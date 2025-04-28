resource "aws_ssm_parameter" "nhs_uk_content_api_key" {
  name             = "/${local.prefix}/CONTENT_API_KEY"
  type             = "SecureString"
  value_wo         = "to-be-replaced-manually"
  value_wo_version = 0
}

resource "aws_ssm_parameter" "nhs_uk_content_api_endpoint" {
  name             = "/${local.prefix}/CONTENT_API_ENDPOINT"
  type             = "SecureString"
  value_wo         = "to-be-replaced-manually"
  value_wo_version = 0
}

resource "aws_ssm_parameter" "nhs_login_url" {
  name             = "/${local.prefix}/NHS_LOGIN_URL"
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

resource "aws_ssm_parameter" "nhs_login_scope" {
  name             = "/${local.prefix}/NHS_LOGIN_SCOPE"
  type             = "SecureString"
  value_wo         = "to-be-replaced-manually"
  value_wo_version = 0
}

resource "aws_ssm_parameter" "vaccination_app_private_key" {
  name             = "/${local.prefix}/VACCINATION_APP_PRIVATE_KEY"
  type             = "SecureString"
  value_wo         = "to-be-replaced-manually"
  value_wo_version = 0
}
