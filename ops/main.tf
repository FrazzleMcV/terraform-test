terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}


resource "aws_s3_bucket" "blog_website_bucket" {
  bucket = "blog-website-bucket-1"
}

resource "aws_s3_bucket_public_access_block" "access_block" {
  bucket = aws_s3_bucket.blog_website_bucket.id

  block_public_acls   = false
  block_public_policy = false
}

data "aws_iam_policy_document" "website_s3_policy" {
  statement {
    sid = "PublicReadGetObject"

    effect = "Allow"
    principals {
      identifiers = ["*"]
      type        = "AWS"
    }
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.blog_website_bucket.arn}/*"
    ]
  }
}

resource "aws_s3_bucket_policy" "website_bucket_policy" {
  bucket = aws_s3_bucket.blog_website_bucket.id
  policy = data.aws_iam_policy_document.website_s3_policy.json
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.blog_website_bucket.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_dynamodb_table" "terra_test_blog_db" {
  name           = "terra_test_blog"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "TestTableHashKey"

  attribute {
    name = "TestTableHashKey"
    type = "S"
  }
}

data "aws_lambda_function" "get_entries_lambda" {
  function_name = "blog-service-1-dev-getBlogEntries"
}

data "aws_lambda_function" "save_entry_lambda" {
  function_name = "blog-service-1-dev-createBlogEntry"
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role_1"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
      }
    ]
  })
}

resource "aws_lambda_permission" "apigw_lambda_1" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = data.aws_lambda_function.get_entries_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.test_api_1.execution_arn}/*/*"
}

resource "aws_apigatewayv2_api" "test_api_1" {
  name          = "test-lambda-api-1"
  protocol_type = "HTTP"
  target        = data.aws_lambda_function.get_entries_lambda.arn

  cors_configuration {
    allow_headers = ["content-type"]
    allow_methods = ["GET", "POST"]
    allow_origins = ["http://${aws_s3_bucket.blog_website_bucket.bucket}.s3-website-us-west-2.amazonaws.com"]
  }
}

resource "aws_apigatewayv2_deployment" "deployment_1" {
  api_id = aws_apigatewayv2_api.test_api_1.id
}

resource "aws_apigatewayv2_integration" "test_integration_1" {
  api_id           = aws_apigatewayv2_api.test_api_1.id
  integration_type = "AWS_PROXY"
  integration_uri  = data.aws_lambda_function.get_entries_lambda.invoke_arn
}

resource "aws_lambda_permission" "apigw_lambda_2" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = data.aws_lambda_function.save_entry_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.test_api_2.execution_arn}/*/*"
}

resource "aws_apigatewayv2_api" "test_api_2" {
  name          = "test-lambda-api-2"
  protocol_type = "HTTP"
  target        = data.aws_lambda_function.save_entry_lambda.arn

  cors_configuration {
    allow_headers = ["content-type"]
    allow_methods = ["GET", "POST"]
    allow_origins = ["http://${aws_s3_bucket.blog_website_bucket.bucket}.s3-website-us-west-2.amazonaws.com"]
  }
}

resource "aws_apigatewayv2_deployment" "deployment_2" {
  api_id = aws_apigatewayv2_api.test_api_2.id
}

resource "aws_apigatewayv2_integration" "test_integration_2" {
  api_id           = aws_apigatewayv2_api.test_api_2.id
  integration_type = "AWS_PROXY"
  integration_uri  = data.aws_lambda_function.save_entry_lambda.invoke_arn
}
