module "content_cache_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 4.11.0"

  bucket        = local.content_cache_bucket_name
  force_destroy = true
  versioning = {
    enabled = true
  }

  tags = local.default_tags
}
