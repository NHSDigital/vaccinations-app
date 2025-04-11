module "deploy" {
  source = "../../modules/deploy_app"

  open-next-path        = local.open_next_path
  prefix                = local.prefix
  nodejs_version        = local.node_version
  cache_lambda_zip_path = local.cache_lambda_zip_path
  default_tags          = local.default_tags
  ssm_prefix            = local.ssm_prefix
  content_cache_path    = "s3://${module.content_cache_s3_bucket.s3_bucket_id}"
  log_retention_in_days = local.log_retention_in_days
  pino_log_level        = local.pino_log_level
}
