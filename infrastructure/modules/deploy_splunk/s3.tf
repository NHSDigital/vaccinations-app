module "failed_firehose_delivery_logs_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 4.11.0"

  bucket        = "${var.prefix}-firehose-delivery-failures"
  force_destroy = false
  tags          = var.default_tags
}

resource "aws_s3_bucket_lifecycle_configuration" "failed_firehose_delivery_logs_s3_bucket_lifecycle_configuration" {
  bucket = module.failed_firehose_delivery_logs_s3_bucket.s3_bucket_id

  rule {
    id = "DeleteLogsFilesAfterExpiration"

    filter {}

    expiration {
      days = var.splunk_log_retention_in_days
    }

    status = "Enabled"
  }
}
