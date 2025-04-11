locals {
  region = "eu-west-2"

  project_identifier           = "vaccinations-app"
  project_identifier_shortcode = "vita"

  environment           = "dev"
  git_branch            = coalesce(data.external.git_branch.result.output, "na")
  deploy_workspace      = terraform.workspace == "default" ? "gh" : terraform.workspace
  prefix                = "${local.deploy_workspace}-${local.git_branch}-${local.project_identifier_shortcode}-${data.aws_caller_identity.current.account_id}"
  ssm_prefix            = "/${local.prefix}/"
  open_next_path        = "../../../.open-next"
  log_retention_in_days = 7
  pino_log_level        = "info"
  node_version          = "nodejs22.x"
  cache_lambda_zip_path = "../../../lambda.zip"

  content_cache_bucket_name = "${local.prefix}-content-cache"

  default_tags = {
    ManagedBy   = "Terraform"
    Project     = local.project_identifier
    Environment = local.environment
  }
}
