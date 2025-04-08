module "content_cache_s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket        = local.content_cache_bucket_name
  force_destroy = true

  tags = local.default_tags
}
