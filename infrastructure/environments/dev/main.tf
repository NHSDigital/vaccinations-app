module "deploy" {
  source = "../../modules/deploy_app"

  open-next-path = "../../../.open-next"
  prefix         = local.project_identifier_shortcode
  default_tags   = local.default_tags
}
