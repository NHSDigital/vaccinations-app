module "deploy_lambda" {
  source = "../../modules/deploy_lambda"

  prefix                            = local.prefix
  nodejs_version                    = local.node_version
  cache_lambda_zip_path             = local.cache_lambda_zip_path
  application_environment_variables = local.application_environment_variables
  log_retention_in_days             = local.log_retention_in_days
  default_tags                      = local.default_tags
  alerting_sns_topic_arn            = module.deploy_monitoring.alerting_sns_topic_arn
}

module "deploy_fake_api" {
  source = "./fake-api"
}

module "deploy" {
  source = "../../modules/deploy_app"

  prefix                            = local.prefix
  open-next-path                    = local.open_next_path
  nodejs_version                    = local.node_version
  log_retention_in_days             = local.log_retention_in_days
  application_environment_variables = merge(local.application_environment_variables,
    {
      ELIGIBILITY_API_ENDPOINT = "${module.deploy_fake_api.application_url}/",
      APIM_AUTH_URL = "${module.deploy_fake_api.application_url}/oauth2/token"
    })
  acm_certificate_arn               = data.aws_acm_certificate.website.arn
  domain                            = local.domain
  sub_domain                        = local.sub_domain
  default_tags                      = local.default_tags
  region                            = local.region
  account_id                        = data.aws_caller_identity.current.account_id
  audit_log_group_name              = local.audit_log_group_name
  alerting_sns_topic_arn            = module.deploy_monitoring.alerting_sns_topic_arn
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

module "deploy_audit" {
  source = "../../modules/deploy_audit"

  prefix                       = local.prefix
  enable_pars                  = local.enable_pars
  audit_log_retention_in_days  = local.audit_log_retention_in_days
  pars_account_id              = local.pars_account_id
  pars_target_environment_name = local.pars_target_environment_name
  audit_log_group_name         = local.audit_log_group_name
  audit_log_stream_name        = local.audit_log_stream_name
  alerting_sns_topic_arn       = module.deploy_monitoring.alerting_sns_topic_arn
  default_tags                 = local.default_tags
}
