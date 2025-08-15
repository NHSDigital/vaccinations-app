module "audit_logs_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 4.11.0"

  bucket        = "${var.prefix}-audit-logs"
  force_destroy = false
  versioning = {
    enabled = true
  }
  object_lock_enabled = true

  tags = var.default_tags
}

resource "aws_s3_bucket_object_lock_configuration" "audit_logs_object_lock_configuration" {
  bucket = module.audit_logs_s3_bucket.s3_bucket_id

  rule {
    default_retention {
      mode = "COMPLIANCE"
      days = var.audit_logs_retention_days
    }
  }
}

resource "aws_s3_bucket_policy" "audit_log_s3_bucket_policy" {
  bucket = module.audit_logs_s3_bucket.s3_bucket_id
  policy = templatefile("${path.module}/policies/audit-s3-bucket-iam-policy.json", {
    s3_bucket_arn = module.audit_logs_s3_bucket.s3_bucket_arn,
    account_id    = var.account_id,
    firehose_arn  = "arn:aws:firehose:eu-west-2:${var.account_id}:deliverystream/ankur-test"
  })
}
