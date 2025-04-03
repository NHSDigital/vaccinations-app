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
