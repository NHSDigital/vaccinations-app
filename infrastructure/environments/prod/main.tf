module "deploy_lambda" {
  source = "../../modules/deploy_lambda"

  prefix                            = local.prefix
  nodejs_version                    = local.node_version
  cache_lambda_zip_path             = local.cache_lambda_zip_path
  application_environment_variables = local.application_environment_variables
  log_retention_in_days             = local.log_retention_in_days
  default_tags                      = local.default_tags
}

module "deploy" {
  source = "../../modules/deploy_app"

  prefix                            = local.prefix
  open-next-path                    = local.open_next_path
  nodejs_version                    = local.node_version
  log_retention_in_days             = local.log_retention_in_days
  application_environment_variables = local.application_environment_variables
  acm_certificate_arn               = data.aws_acm_certificate.website.arn
  domain                            = local.domain
  sub_domain                        = local.sub_domain
  default_tags                      = local.default_tags
  region                            = local.region
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
