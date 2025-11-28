module "deploy_lambda" {
  source = "../../modules/deploy_lambda"

  prefix                = local.prefix
  nodejs_version        = local.node_version
  cache_lambda_zip_path = local.cache_lambda_zip_path
  application_environment_variables = merge(local.application_environment_variables,
    {
      ELIGIBILITY_API_ENDPOINT          = "${module.deploy_fake_api.application_url}/",
      APIM_AUTH_URL                     = "${module.deploy_fake_api.application_url}/oauth2/token",
      CONTENT_API_RATE_LIMIT_PER_MINUTE = 120,
  })
  log_retention_in_days  = local.log_retention_in_days
  default_tags           = local.default_tags
  alerting_sns_topic_arn = module.deploy_monitoring.alerting_sns_topic_arn
  account_id             = data.aws_caller_identity.current.account_id
  region                 = local.region
}

module "deploy_fake_api" {
  source = "./fake-api"
}

module "deploy_load_generator" {
  source = "./load-generator"

  s3_bucket_name = module.load_testing_s3_bucket.s3_bucket_id
  account_id     = data.aws_caller_identity.current.account_id
  depends_on     = [module.deploy_fake_api]
}

module "deploy" {
  source = "../../modules/deploy_app"

  prefix                = local.prefix
  open-next-path        = local.open_next_path
  nodejs_version        = local.node_version
  log_retention_in_days = local.log_retention_in_days
  application_environment_variables = merge(local.application_environment_variables,
    {
      ELIGIBILITY_API_ENDPOINT = "${module.deploy_fake_api.application_url}/",
      APIM_AUTH_URL            = "${module.deploy_fake_api.application_url}/oauth2/token"
  })
  acm_certificate_arn    = data.aws_acm_certificate.website.arn
  domain                 = local.domain
  sub_domain             = local.sub_domain
  default_tags           = local.default_tags
  region                 = local.region
  account_id             = data.aws_caller_identity.current.account_id
  alerting_sns_topic_arn = module.deploy_monitoring.alerting_sns_topic_arn
}

resource "aws_cloudfront_monitoring_subscription" "enable_more_cloudfront_metrics" {
  count           = var.is_github_action ? 1 : 0
  distribution_id = module.deploy.cloudfront_distribution_id

  monitoring_subscription {
    realtime_metrics_subscription_config {
      realtime_metrics_subscription_status = "Enabled"
    }
  }
}

module "deploy_monitoring" {
  source = "../../modules/deploy_monitoring"

  prefix                     = local.prefix
  environment                = local.environment
  default_tags               = local.default_tags
  alarms_slack_channel_id    = local.alarms_slack_channel_id
  cloudfront_distribution_id = module.deploy.cloudfront_distribution_id
  is_local                   = !var.is_github_action
}

module "deploy_splunk" {
  count  = var.is_github_action ? 1 : 0
  source = "../../modules/deploy_splunk"

  prefix                       = local.prefix
  default_tags                 = local.default_tags
  splunk_log_retention_in_days = local.splunk_log_retention_in_days
  region                       = local.region
  account_id                   = data.aws_caller_identity.current.account_id
  alerting_sns_topic_arn       = module.deploy_monitoring.alerting_sns_topic_arn
  python_version               = local.python_version
}
