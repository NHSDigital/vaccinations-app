data "aws_lambda_functions" "all_lambda_functions" {}

locals {
  warmer_function_name = one([
    for name in data.aws_lambda_functions.all_lambda_functions.function_names :
    name if length(regexall("^${var.prefix}.*warmer-function$", name)) == 1
  ])

  warmer_function_arn = one([
    for arn in data.aws_lambda_functions.all_lambda_functions.function_arns :
    arn if length(regexall("^${var.prefix}.*warmer-function$", split(":", arn)[6])) == 1
  ])
}
