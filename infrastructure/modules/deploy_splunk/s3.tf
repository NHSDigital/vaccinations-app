module "failed_firehose_delivery_logs_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 4.11.0"

  bucket        = "${var.prefix}-firehose-delivery-failures"
  force_destroy = false
  tags          = var.default_tags
}
