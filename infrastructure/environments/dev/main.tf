module "deploy" {
  source = "../../modules/deploy_app"

  open-next-path = local.open_next_path
  prefix         = local.prefix
  default_tags   = local.default_tags
  ssm_prefix     = local.ssm_prefix
}
