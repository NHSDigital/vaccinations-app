data "aws_secretsmanager_secret" "splunk_hec_token" {
  name = "/vita/splunk/hec/token"
}

data "aws_secretsmanager_secret_version" "splunk_hec_token_id" {
  secret_id = data.aws_secretsmanager_secret.splunk_hec_token.id
}

data "aws_secretsmanager_secret" "splunk_hec_endpoint" {
  name = "/vita/splunk/hec/endpoint"
}

data "aws_secretsmanager_secret_version" "splunk_hec_endpoint_id" {
  secret_id = data.aws_secretsmanager_secret.splunk_hec_endpoint.id
}
