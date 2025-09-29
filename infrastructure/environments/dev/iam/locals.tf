locals {
  region = "eu-west-2"

  project_identifier           = "vaccinations-app"
  project_identifier_shortcode = "vita"

  environment      = "dev"
  deploy_workspace = var.is_github_action ? "gh" : terraform.workspace
  prefix           = "${local.deploy_workspace}-${local.project_identifier_shortcode}-${data.aws_caller_identity.current.account_id}"

  default_tags = {
    ManagedBy   = "Terraform"
    Project     = local.project_identifier
    Environment = local.environment
  }
}

resource "null_resource" "check_workspace" {
  lifecycle {
    precondition {
      condition     = var.is_github_action || terraform.workspace != "default"
      error_message = <<EOT
  ❌ Default workspace is not allowed locally. It is reserved for GitHub actions.
  ✅ Please switch to a named workspace like this (replace <name> with your workspace):
  ( cd infrastructure/environments/dev; terraform workspace select <name>; terraform workspace list )
  EOT
    }
  }
}
