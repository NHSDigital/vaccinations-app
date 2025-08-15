resource "aws_kinesis_firehose_delivery_stream" "audit_logs_kinesis_firehose_delivery_stream" {
  name        = "${var.prefix}-audit-logs-delivery-stream"
  destination = "extended_s3"

  server_side_encryption {
    enabled = true
  }

  extended_s3_configuration {
    role_arn = aws_iam_role.audit_logs_kineses_iam_role.arn

    bucket_arn          = module.audit_logs_s3_bucket.s3_bucket_arn
    prefix              = "records/year=!{partitionKeyFromQuery:year}/month=!{partitionKeyFromQuery:month}/day=!{partitionKeyFromQuery:day}/"
    error_output_prefix = "errors/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/hour=!{timestamp:HH}/result=!{firehose:error-output-type}/"

    buffering_size     = var.audit_logs_buffering_size_mb
    buffering_interval = var.audit_logs_buffering_interval_seconds
    custom_time_zone   = "UTC"
    s3_backup_mode     = "Disabled"

    cloudwatch_logging_options {
      enabled         = true
      log_group_name  = aws_cloudwatch_log_group.audit_logs_kinesis_firehose_cloudwatch_log_group.name
      log_stream_name = aws_cloudwatch_log_stream.audit_logs_kinesis_firehose_cloudwatch_log_stream.name
    }

    dynamic_partitioning_configuration {
      enabled = "true"
    }

    processing_configuration {
      enabled = "true"

      processors {
        type = "MetadataExtraction"

        parameters {
          parameter_name  = "JsonParsingEngine"
          parameter_value = "JQ-1.6"
        }

        parameters {
          parameter_name  = "MetadataExtractionQuery"
          parameter_value = "{ year: .recorded|split(\"T\")[0]|strptime(\"%Y-%m-%d\")|strftime(\"%Y\"), month: .recorded|split(\"T\")[0]|strptime(\"%Y-%m-%d\")|strftime(\"%m\"), day: .recorded|split(\"T\")[0]|strptime(\"%Y-%m-%d\")|strftime(\"%d\")}"
        }
      }

      processors {
        type = "AppendDelimiterToRecord"
      }
    }

    data_format_conversion_configuration {
      enabled = true
      input_format_configuration {
        deserializer {
          open_x_json_ser_de {
            # DO NOT SET case_insensitive = true
            # Is will cause the original FHIR JSON in the _data column to have all keys converted to lower case, making
            # it invalid FHIR, from the Terraform docs:
            #
            # case_insensitive - (Optional) When set to true, which is the default, Kinesis Data Firehose converts JSON
            # keys to lowercase before deserializing them.
            #
            # See:
            #    https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/kinesis_firehose_delivery_stream#open_x_json_ser_de-block
            case_insensitive            = false
            column_to_json_key_mappings = {}

            convert_dots_in_json_keys_to_underscores = false
          }
        }
      }

      output_format_configuration {
        serializer {
          parquet_ser_de {
            compression = "SNAPPY"
          }
        }
      }

      schema_configuration {
        database_name = aws_glue_catalog_database.audit_logs_glue_database.name
        role_arn      = aws_iam_role.audit_logs_kineses_iam_role.arn
        table_name    = aws_glue_catalog_table.audit_logs_firehose_conversion.name
      }
    }
  }
}
