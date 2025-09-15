resource "aws_kinesis_firehose_delivery_stream" "splunk_log_forwarder" {
  name        = "${var.prefix}-splunk-log-forwarder"
  destination = "splunk"

  splunk_configuration {
    hec_endpoint               = data.aws_secretsmanager_secret_version.splunk_hec_endpoint_id.secret_string
    hec_token                  = data.aws_secretsmanager_secret_version.splunk_hec_token_id.secret_string
    hec_acknowledgment_timeout = 180
    retry_duration             = 300
    hec_endpoint_type          = "Event"
    s3_backup_mode             = "FailedEventsOnly"
    buffering_interval         = 60
    buffering_size             = 5

    s3_configuration {
      role_arn           = aws_iam_role.firehose_splunk_log_forwarder_role.arn
      bucket_arn         = module.failed_firehose_delivery_logs_s3_bucket.s3_bucket_arn
      buffering_size     = 5
      buffering_interval = 300
      compression_format = "GZIP"
    }
    cloudwatch_logging_options {
      enabled         = true
      log_group_name  = aws_cloudwatch_log_group.splunk_firehose_logs.name
      log_stream_name = aws_cloudwatch_log_stream.splunk_firehose_logs_stream.name
    }

    processing_configuration {
      enabled = "true"

      processors {
        type = "Lambda"

        parameters {
          parameter_name  = "LambdaArn"
          parameter_value = "${module.firehose_transformer_lambda_function.lambda_function_arn}:$LATEST"
        }
        parameters {
          parameter_name  = "RoleArn"
          parameter_value = aws_iam_role.firehose_splunk_log_forwarder_role.arn
        }
        parameters {
          parameter_name  = "BufferSizeInMBs"
          parameter_value = "0.256" # Should this be passed from main file?
        }
        parameters {
          parameter_name  = "BufferIntervalInSeconds"
          parameter_value = "60" # Should this be passed from main file?
        }
      }
    }
  }
}

resource "aws_cloudwatch_log_group" "splunk_firehose_logs" {
  name              = "/aws/firehose/${var.prefix}-splunk-log-forwarder"
  retention_in_days = var.splunk_log_retention_in_days
}

resource "aws_cloudwatch_log_stream" "splunk_firehose_logs_stream" {
  log_group_name = aws_cloudwatch_log_group.splunk_firehose_logs.name
  name           = "forwarder"
}
