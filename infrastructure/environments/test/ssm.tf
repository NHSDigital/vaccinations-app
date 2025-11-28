# TODO: Delete this file when we cut an R2 release
# The scheduled assurances will fail if SSM parameters are deleted and redeployed whilst we still have R1
resource "aws_ssm_parameter" "nhs_uk_content_api_key" {
  name             = "/${local.prefix}/CONTENT_API_KEY"
  type             = "SecureString"
  value_wo         = "to-be-replaced-manually"
  value_wo_version = 0
}

resource "aws_ssm_parameter" "nhs_login_client_id" {
  name             = "/${local.prefix}/NHS_LOGIN_CLIENT_ID"
  type             = "SecureString"
  value_wo         = "to-be-replaced-manually"
  value_wo_version = 0
}

resource "aws_ssm_parameter" "nhs_login_private_key" {
  name             = "/${local.prefix}/NHS_LOGIN_PRIVATE_KEY"
  type             = "SecureString"
  value_wo         = "to-be-replaced-manually"
  value_wo_version = 0
}

resource "aws_ssm_parameter" "eligibility_api_key" {
  name             = "/${local.prefix}/ELIGIBILITY_API_KEY"
  type             = "SecureString"
  value_wo         = "to-be-replaced-manually"
  value_wo_version = 0
}

resource "aws_ssm_parameter" "apim_private_key" {
  name             = "/${local.prefix}/APIM_PRIVATE_KEY"
  type             = "SecureString"
  value_wo         = "to-be-replaced-manually"
  value_wo_version = 0
}

resource "aws_ssm_parameter" "auth_secret" {
  name             = "/${local.prefix}/AUTH_SECRET"
  type             = "SecureString"
  value_wo         = random_password.auth_secret.result
  value_wo_version = 0
}

resource "random_password" "auth_secret" {
  length           = 64
  special          = true
  override_special = "/+"
}
