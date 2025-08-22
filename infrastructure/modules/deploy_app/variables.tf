variable "account_id" {
  type        = string
  description = "AWS Account Id"
}

variable "prefix" {
  type        = string
  description = "Prefix to be applied to resources created"
}

variable "nodejs_version" {
  type        = string
  description = "Version of the nodejs to use, e.g. 'nodejs22.x'"
}

variable "open-next-path" {
  type        = string
  description = "Relative path to open next output directory"
}

variable "default_tags" {
  type        = map(string)
  description = "Map of default key-value pair of tags to add to resources"
}

variable "log_retention_in_days" {
  type        = string
  description = "The retention of logs in cloudwatch log groups in days"
}

variable "application_environment_variables" {
  type        = map(string)
  description = "Map of environment variables to pass to Lambda"
}

variable "acm_certificate_arn" {
  type        = string
  description = "ACM certificate arn to use for cloudfront distribution"
}

variable "sub_domain" {
  type        = string
  description = "The subdomain representing the environment for the website. Empty for prod."
}

variable "domain" {
  type        = string
  description = "The main domain for the website"
}

variable "region" {
  type        = string
  description = "The AWS region to deploy to"
}

variable "audit_log_group_name" {
  type        = string
  description = "Log Group name for audit logs"
}
