resource "aws_glue_catalog_database" "audit_logs_glue_database" {
  name = "${var.prefix}-audit-logs"
}

resource "aws_glue_catalog_table" "audit_logs_firehose_conversion" {
  database_name = aws_glue_catalog_database.audit_logs_glue_database.name
  description   = "Table for Kinesis Data Firehose conversions"
  name          = "${var.prefix}-audit-logs-firehose-conversion"

  storage_descriptor {
    dynamic "columns" {
      for_each = local.record_schema_glue

      content {
        comment = columns.value.description
        name    = columns.key
        type    = columns.value.type
      }
    }
  }
}
