using System.ComponentModel.DataAnnotations;

namespace IDMS.UserAuthentication.Models.Authentication.SignUp
{
    public class ResetPassword
    {
        [Required]
        public string Password { get; set; } = null;

        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; } = null;

        public string Email { get; set; } = null;
        public string Token { get; set; } = null;

    }

    public static class ResetLinkBody
    {
        public const string MessageBody = @"
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset='UTF-8'>
                  <title>Password Reset</title>
                </head>
                <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                  <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px;'>
                    <h2 style='color: #333333; text-align: center;'>Password Reset</h2>
                    <p>We received a request to reset your password. Click the button below to choose a new password:</p>
    
                    <p style='text-align: center;'>
                      <a href='{{ResetLink}}' style='background-color: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;'>
                        Reset Your Password
                      </a>
                    </p>

                    <p>If you didn’t request a password reset, you can safely ignore this email. This link will expire in 24 hours for your security.</p>

                    <p>Thanks,<br>{{CompanyName}}</p>

                    <hr style='margin-top: 40px;'>
                    <p style='font-size: 12px; color: #888888;'>If you’re having trouble clicking the button, copy and paste the URL below into your browser:</p>
                    <p style='font-size: 12px; color: #888888;'>{{ResetLink}}</p>
                  </div>
                </body>
                </html>";



        public const string MessageBody1 = @"
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset='UTF-8'>
                  <title>Password Reset</title>
                </head>
                <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                  <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px;'>
                    <h2 style='color: #333333; text-align: center;'>Password Reset</h2>
                    <p>We received a request to reset your password. Click the button below to choose a new password:</p>
    
                     <p style='text-align: center;'>
                      <table cellspacing='0' cellpadding='0' border='0' align='center' style='margin: auto;'>
                        <tr>
                          <td align='center' bgcolor='#007BFF' style='border-radius: 4px;'>
                            <a href='{{ResetLink}}'
                               target='_blank'
                               style='font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 12px 24px; display: inline-block;'>
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>
                    </p>

                    <p>If you didn’t request a password reset, you can safely ignore this email. This link will expire in 24 hours for your security.</p>

                    <p>Thanks,<br>{{CompanyName}}</p>

                    <hr style='margin-top: 40px;'>
                    <p style='font-size: 12px; color: #888888;'>If you’re having trouble clicking the button, copy and paste the URL below into your browser:</p>
                    <p style='font-size: 12px; color: #888888;'>{{ResetLink}}</p>
                  </div>
                </body>
                </html>";

        public const string MessageBody2 = @"
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset='UTF-8'>
                  <title>Password Reset</title>
                </head>
                <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                  <div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px;'>
                    <h2 style='color: #333333; text-align: center;'>Password Reset</h2>
                    <p>If you've lost your password or wish to reset it, use the link below to get started</p>
    
                     <p style='text-align: center;'>
                      <table cellspacing='0' cellpadding='0' border='0' align='center' style='margin: auto;'>
                        <tr>
                          <td align='center' bgcolor='#007BFF' style='border-radius: 4px;'>
                            <a href='{{ResetLink}}'
                               target='_blank'
                               style='font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 12px 24px; display: inline-block;'>
                              Reset Your Password
                            </a>
                          </td>
                        </tr>
                      </table>
                    </p>

                    <p>If you didn’t request a password reset, you can safely ignore this email. Only a person with access to your email can reset your account password.</p>

                    <hr style='margin-top: 40px;'>
                    <p style='font-size: 12px; color: #888888;'>If you’re having trouble clicking the button, copy and paste the URL below into your browser:</p>
                    <p style='font-size: 12px; color: #888888;'>{{ResetLink}}</p>
                  </div>
                </body>
                </html>";
    }
}
