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
  default_tags                      = local.default_tags
}
