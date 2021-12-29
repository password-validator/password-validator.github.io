import { html } from '../lib.js';
import { get } from '../api/api.js'

const homeTemplate = (onLogKey, onShowPassword, msg) => html`
<div class="container">
    <form>
        <label for="psw">Password</label> <br />
        <div class="password-container">
            <input type="password" class="nostyle" id="psw" name="psw" @keyup=${onLogKey}>
            <div class="checkbox">
                <span class="checkbox-item" @click=${onShowPassword}></span>
                <span>Show</span>  
            </div>
        </div>
    </form>
    <ul>
        <li id="minimum-characters">8-72 Characters</li>
        <li id="small-case">1 Lowercase Character</li>
        <li id="email">Should Not Match Your Email Address</li>
        <li id="capital">1 Uppercase Character</li>
        <li id="number">1 Number</li>
    </ul>
</div>

`;

export async function homePage(ctx) {
    ctx.render(homeTemplate(onLogKey, onShowPassword));
    const minLength = document.getElementById("minimum-characters");
    const smallCase = document.getElementById("small-case");
    const notEmail = document.getElementById("email");
    const capital = document.getElementById("capital");
    const containsNumber = document.getElementById("number");
    const url = 'https://run.mocky.io/v3/09e642b5-b52f-43c1-837b-8ebf70c10813';
    const userData = await get(url);

    async function onLogKey(event) {
        const psw = event.target.value.trim();
        //const pattern = /^(?=.*\d)(?=[a-z]*)(?=[A-Z]*).{8,72}$/g;
        const email = userData.user.email;
        const username = email.split('@')[0];
        const validRuleEmail = psw != email && !psw.includes(username);
        let invalid = false;

        if (validRuleEmail) {
            checkRule(validRuleEmail, notEmail);
        } else {
            invalid = true;
            checkRule(validRuleEmail, notEmail);
        }
        //Validate min length
        checkRule(psw.length >= 8 && psw.length <= 72, minLength);

        var patterns = [/[a-z]/g, /[A-Z]/g, /[\d]/g];
        var items = [smallCase, capital, containsNumber];
        patterns.forEach(matchPattern);
        
        invalidInput(invalid);

        function invalidInput(invalid) {
            let targetClassList = event.target.classList;
            if (!invalid) {
                targetClassList.remove('invalid');
                targetClassList.add('valid');
            } else {
                targetClassList.remove('valid');
                targetClassList.add('invalid');
            }
        }

        function matchPattern(pattern, ind) {
            checkRule(psw.match(pattern), items[ind]);
        }

        function checkRule(check, el) {
            if (check && psw != '') {
                el.style.textDecoration = "line-through";
            } else {
                invalid = true;
                el.style.textDecoration = "none";
            }
        }
    }

    async function onShowPassword(event) {
        const psw = document.getElementById("psw");
        const checkBoxClassList = event.target.classList;
        if (!checkBoxClassList.contains('checked')) {
            psw.type = "text";
            checkBoxClassList.add('checked');
        } else {
            psw.type = "password";
            checkBoxClassList.remove('checked');
        }
    }

}