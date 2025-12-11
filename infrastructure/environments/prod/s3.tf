module "content_cache_s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 5.0"

  bucket                           = local.content_cache_bucket_name
  force_destroy                    = true
  skip_destroy_public_access_block = false
  versioning = {
    enabled = true
  }

  tags = local.default_tags
}
