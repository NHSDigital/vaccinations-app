output "cloudfront_url" {
  value = module.deploy_app.cloudfront_url
  description = "The URL for the cloudfront distribution"
}
