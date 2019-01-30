$(function() {

    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    var log = console.log;

    /*

    new DialogAddUser('dialog-form', {
        title: "Create new user",
        tips: "All form fields are required.",
        height: 400,
        width: 750,
        fields: [{
            name: "Name",
            type: "text",
            id: "name",
            value: "Jane Smith",
            minSize: 3,
            maxSize: 16,
            regexp: /^[a-z]([0-9a-z_\s])+$/i,
            errMsg: "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter."
        },{
            name: "Email",
            type: "text",
            id: "email",
            value: "jane@smith.com",
            minSize: 6,
            maxSize: 80,
            regexp: emailRegex,
            errMsg: "eg. ui@jquery.com"
        },{
            name: "Password",
            type: "password",
            id: "password",
            value: "xxxxxxx",
            minSize: 5,
            maxSize: 16,
            regexp: /^([0-9a-zA-Z])+$/,
            errMsg: "Password field only allow : a-z 0-9"

        }],
        buttons: {
            "Create an account": addUser,
            "Cancel": function() {
                dialog.close();
            }
        },
    });
    */


    class DialogAddUser {
        constructor(idDialog, params) {
            this.params = params;
            this.params.idDialog = '#' + idDialog;
            log('this.params===', this.params)

            //this.emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

            var html = this.getHtml();
            // log('html===', html)
            $("body").append(html);
            this.init();

            // if ($(this.idDialog).length) {
            //     log('---1')
            //     this.init();
            // } else {
            //     log('---2')
            //     var THIS = this;
            //     $.get( "dialog/dialog-modal.html", function( data ) {
            //         $("body").append(data);
            //         setTimeout(function() {
            //             THIS.init();
            //         }, 500);
            //     });
            // }
        }

        getHtml() {
            return `
<div id="dialog-form" title="` + this.params.title + `" style="display:none;">
    <p class="validateTips">` + this.params.tips + `</p>

    <form>
        <!--<fieldset>-->
            Name:
            <input type="text" name="name" id="name" value="Jane Smith" class="text ui-widget-content ui-corner-all">
            <label for="email">Email</label>
            <input type="text" name="email" id="email" value="jane@smith.com" class="text ui-widget-content ui-corner-all">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" value="xxxxxxx" class="text ui-widget-content ui-corner-all">

            <!-- Allow form submission with keyboard without duplicating the dialog button -->
            <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
        <!--</fieldset>-->
    </form>
</div>
        `;
        }

        init() {
            log('---init')

            for(var i in this.params.fields) {
                this.params.fields[i].selector = $('#' + this.params.fields[i].id);
            }
            this.tips = $(".validateTips")
            var THIS = this;

            // this.params.callback = this.params.buttons[this.params.buttons['submit']];
            this.params.buttons = {
                "Create an account": function (event) {
                    log('---submit')
                    event.preventDefault();
                    THIS.callCallback(THIS)
                },
                "Cancel": function () { THIS.close(THIS); }
            }


            this.dialog = $(this.params.idDialog).dialog({
                autoOpen: false,
                height: this.params.height,
                width: this.params.width,
                modal: true,
                buttons: this.params.buttons,
            });

            this.form = this.dialog.find("form").on("submit", function (event) {
                log('---submit')
                event.preventDefault();
                THIS.callCallback(THIS)
            });
        }

        callCallback(THIS) {
            if (THIS.validate(THIS)) {
                if (THIS.params.callback) {
                    var result = []
                    for(var i in THIS.params.fields) {
                        result.push(THIS.params.fields[i].selector.val());
                    }
                    // THIS.params.callback([THIS.name.val(), THIS.email.val(), THIS.password.val()]);
                    THIS.params.callback(result);
                    THIS.close(THIS);
                }
            }
        }

        validate(THIS) {
            log('---validate')
            var valid = true;
            for(var i in THIS.params.fields) {
                THIS.params.fields[i].selector.removeClass("ui-state-error");
            }

            for(i in THIS.params.fields) {
                valid = valid && THIS.checkLength(THIS, THIS.params.fields[i].selector, THIS.params.fields[i].id, THIS.params.fields[i].minSize, THIS.params.fields[i].maxSize);
                valid = valid && THIS.checkRegexp(THIS, THIS.params.fields[i].selector, THIS.params.fields[i].regexp, THIS.params.fields[i].errMsg);
            }

            // valid = valid && THIS.checkLength(THIS, THIS.name, "username", 3, 16);
            // valid = valid && THIS.checkRegexp(THIS, THIS.name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
            //
            // valid = valid && THIS.checkLength(THIS, THIS.email, "email", 6, 80);
            // valid = valid && THIS.checkRegexp(THIS, THIS.email, emailRegex, "eg. ui@jquery.com");
            //
            // valid = valid && THIS.checkLength(THIS, THIS.password, "password", 5, 16);
            // valid = valid && THIS.checkRegexp(THIS, THIS.password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9");

            return valid;
        }

        updateTips(THIS, t) {
            // log('---updateTips   THIS===', THIS)
            THIS.tips.text(t).addClass("ui-state-highlight");
            setTimeout(function () {
                THIS.tips.removeClass("ui-state-highlight", 1500);
            }, 500);
        }

        checkLength(THIS, o, n, min, max) {
            // log('---checkLength   THIS===', THIS)
            if (o.val().length > max || o.val().length < min) {
                o.addClass("ui-state-error");
                THIS.updateTips(THIS, "Length of " + n + " must be between " + min + " and " + max + ".");
                return false;
            } else {
                return true;
            }
        }

        checkRegexp(THIS, o, regexp, n) {
            if (!(regexp.test(o.val()))) {
                o.addClass("ui-state-error");
                THIS.updateTips(THIS, n);
                return false;
            } else {
                return true;
            }
        }

        open() {
            // log('---open')
            this.dialog.dialog("open");
        }

        close(THIS) {
            for(var i in THIS.params.fields) {
                THIS.params.fields[i].selector.removeClass("ui-state-error");
            }
            THIS.form[0].reset();
            THIS.dialog.dialog('close');
        }
    }


    var dialog = new DialogAddUser('dialog-form', {
        title: "Create new user 111",
        tips: "All form fields are required. 222",
        //height: 400,
        //width: 750,
        fields: [{
            name: "Name",
            type: "text",
            id: "name",
            value: "Jane Smith",
            minSize: 3,
            maxSize: 16,
            regexp: /^[a-z]([0-9a-z_\s])+$/i,
            errMsg: "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter."
        },{
            name: "Email",
            type: "text",
            id: "email",
            value: "jane@smith.com",
            minSize: 6,
            maxSize: 80,
            regexp: emailRegex,
            errMsg: "eg. ui@jquery.com"
        },{
            name: "Password",
            type: "password",
            id: "password",
            value: "xxxxxxx",
            minSize: 5,
            maxSize: 16,
            regexp: /^([0-9a-zA-Z])+$/,
            errMsg: "Password field only allow : a-z 0-9"

        }],
        callback: function (result) {
            log('---callback   result===', result)
            $("#users tbody").append("<tr>" +
                "<td>" + result[0] + "</td>" +
                "<td>" + result[1] + "</td>" +
                "<td>" + result[2] + "</td>" +
                "</tr>");
        }
    });

    $( function() {
        $( "#create-user" ).button().on( "click", function() {
            dialog.open();
        });
    });


});

