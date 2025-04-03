variable "prefix" {
  type        = string
  description = "Prefix to be applied to resources created"
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
