variable "prefix" {
  type        = string
  description = "Prefix to be applied to resources created"
}

variable "default_tags" {
  type = map(string)
  description = "Map of default key-value pair of tags to add to resources"
}
