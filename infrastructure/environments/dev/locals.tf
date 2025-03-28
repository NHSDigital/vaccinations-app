locals {
  region = "eu-west-2"

  project_identifier           = "vaccinations-app"
  project_identifier_shortcode = "vita"

  environment   = "dev"
  git_branch    = coalesce(data.external.git_branch.result.output, "main")
  deploy_source = coalesce(data.external.deploy_source.result.output, "lo")

  default_tags = {
    ManagedBy   = "Terraform"
    Project     = local.project_identifier
    Environment = local.environment
  }
}
