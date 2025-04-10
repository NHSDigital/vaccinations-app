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
