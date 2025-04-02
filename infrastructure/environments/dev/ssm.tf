resource "aws_ssm_parameter" "nhs_uk_content_api_key" {
  name  = "CONTENT_API_KEY"
  type  = "SecureString"
  value = "to-be-replaced-manually"
}

resource "aws_ssm_parameter" "nhs_uk_content_api_endpoint" {
  name  = "CONTENT_API_ENDPOINT"
  type  = "SecureString"
  value = "to-be-replaced-manually"
}
