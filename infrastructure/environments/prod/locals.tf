locals {
  region = "eu-west-2"

  project_identifier           = "vaccinations-app"
  project_identifier_shortcode = "vita"

  domain                    = "vaccinations.nhs.uk"
  sub_domain                = null
  environment               = "prod"
  git_branch                = coalesce(data.external.git_branch.result.output, "na")
  deploy_workspace          = var.is_github_action ? "gh" : terraform.workspace
  prefix                    = "${local.deploy_workspace}-${local.project_identifier_shortcode}-${data.aws_caller_identity.current.account_id}"
  open_next_path            = "../../../.open-next"
  node_version              = "nodejs22.x"
  log_retention_in_days     = 90
  cache_lambda_zip_path     = "../../../lambda.zip"
  content_cache_bucket_name = "${local.prefix}-content-cache"
  app_version               = var.app_version
  alarms_slack_channel_id   = var.alarms_slack_channel_id

  application_environment_variables = {
    SSM_PREFIX = "/${local.prefix}/"

    PINO_LOG_LEVEL     = "warn"
    DEPLOY_ENVIRONMENT = local.environment

    CONTENT_API_ENDPOINT = "https://api.service.nhs.uk/"
    CONTENT_CACHE_PATH   = "s3://${local.content_cache_bucket_name}"

    NHS_LOGIN_URL              = "https://auth.login.nhs.uk/"
    NHS_LOGIN_SCOPE            = "openid profile"
    NHS_APP_REDIRECT_LOGIN_URL = "https://www.nhsapp.service.nhs.uk/login?redirect_to=index"

    MAX_SESSION_AGE_MINUTES = 59

    ELIGIBILITY_API_ENDPOINT = "https://api.service.nhs.uk/"

    AUTH_TRUST_HOST = "true"
    AUTH_SECRET     = random_password.auth_secret.result
    APP_VERSION     = local.app_version

    NBS_URL          = "https://nhs.uk/nbs" // TODO: unconfirmed - is this correct url?
    NBS_BOOKING_PATH = "/nhs-app"
  }

  default_tags = {
    ManagedBy   = "Terraform"
    Project     = local.project_identifier
    Environment = local.environment
  }
}

resource "random_password" "auth_secret" {
  length           = 64
  special          = true
  override_special = "/+"
}

resource "null_resource" "check_workspace" {
  lifecycle {
    precondition {
      condition     = var.is_github_action && terraform.workspace == "default"
      error_message = <<EOT
  ❌ Deployment can only be run from GitHub actions.
  EOT
    }
  }
}
