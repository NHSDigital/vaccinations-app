module "cloudfront_access_logs_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 4.11.0"

  bucket = "${var.prefix}-cloudfront-access-logs"
  tags   = var.default_tags
}
