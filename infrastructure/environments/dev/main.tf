module "deploy" {
  source = "../../modules/deploy_app"

  prefix                = local.prefix
  open-next-path        = local.open_next_path
  nodejs_version        = local.node_version
  log_retention_in_days = local.log_retention_in_days
  cache_lambda_zip_path = local.cache_lambda_zip_path
  default_tags          = local.default_tags
  ssm_prefix            = local.ssm_prefix
  pino_log_level        = local.pino_log_level
  content_api_endpoint  = local.content_api_endpoint
  content_cache_path    = "s3://${module.content_cache_s3_bucket.s3_bucket_id}"
  nhs_login_url         = local.nhs_login_url
  nhs_login_scope       = local.nhs_login_scope
  auth_url              = local.auth_url
}

module "post_deploy" {
  source = "../../modules/post_deploy"

  default_tags = local.default_tags
  prefix       = local.prefix

  depends_on = [module.deploy]
}
