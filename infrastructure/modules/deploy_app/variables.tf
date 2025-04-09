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

variable "ssm_prefix" {
  type = string
  description = "Prefix to be applied to SSM parameters"
}

variable "content_cache_path" {
  type = string
  description = "The s3 bucket for storing content cache"
}

variable "log_retention_in_days" {
  type = string
  description = "The retention of logs in cloudwatch log groups in days"
}

variable "pino_log_level" {
  type = string
  description = "The minimum log level for Pino logger"
}
