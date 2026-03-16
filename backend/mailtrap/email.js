import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";




export const sendVerificationEmail = async (email, verificationToken) => {

    const recipient = [{ email }];


    try {

        const response = await mailtrapClient.send({
            from: sender,
			to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        })

        console.log("Email sent successfully", response);

        
    } catch (error) {

        console.error(`Error sending verification`, error);
        throw new Error(`Error sending verification email: ${error}`);

        
    }


}

export const sendWelcomeEmail = async (email, name) => {

    const recipient = [{ email }];


    try {
        const response =  await mailtrapClient.send({

            from: sender,
			to: recipient,
            template_uuid: "3de6d1e2-9ca9-416b-a87c-4f291f3895dd",
            template_variables: {
            name: "Sangam Shinde",
            company_info_name: "SPS"
            }
        }) 
        console.log("Welcome email sent successfully", response);

        
    } catch (error) {

        console.error(`Error sending welcome email`, error);
        throw new Error(`Error sending welcome email: ${error}`);
        
    }


}




