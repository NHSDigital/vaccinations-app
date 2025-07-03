variable "prefix" {
  type        = string
  description = "Prefix to be applied to resources created"
}

variable "nodejs_version" {
  type        = string
  description = "Version of the nodejs to use, e.g. 'nodejs22.x'"
}

variable "default_tags" {
  type        = map(string)
  description = "Map of default key-value pair of tags to add to resources"
}

variable "application_environment_variables" {
  type        = map(string)
  description = "Map of environment variables to pass to Lambda"
}

variable "cache_lambda_zip_path" {
  type        = string
  description = "Path to lambda zip artifact"
}

variable "log_retention_in_days" {
  type        = string
  description = "The retention of logs in cloudwatch log groups in days"
}

variable "region" {
  type        = string
  description = "The AWS region to deploy to"
}
