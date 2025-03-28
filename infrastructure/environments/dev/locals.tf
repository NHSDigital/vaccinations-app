locals {
  region = "eu-west-2"

  project_identifier           = "vaccinations-app"
  project_identifier_shortcode = "vita"

  environment      = "dev"
  git_branch       = coalesce(data.external.git_branch.result.output, "na")
  deploy_workspace = terraform.workspace == "default" ? "gh" : terraform.workspace

  default_tags = {
    ManagedBy   = "Terraform"
    Project     = local.project_identifier
    Environment = local.environment
  }
}
