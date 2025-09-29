module "deploy_iam" {
  source = "../../../modules/deploy_iam"

  account_id        = data.aws_caller_identity.current.account_id
  prefix            = local.prefix
  region            = local.region
  environment       = local.environment
  project_shortcode = local.project_identifier_shortcode
  is_local          = !var.is_github_action
}
