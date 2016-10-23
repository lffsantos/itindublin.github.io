function IsEmail(email){
    var exclude=/[^@\-\.\w]|^[_@\.\-]|[\._\-]{2}|[@\.]{2}|(@)[^@]*\1/;
    var check=/@[\w\-]+\./;
    var checkend=/\.[a-zA-Z]{2,3}$/;
    if(((email.search(exclude) != -1)||(email.search(check)) == -1)||(email.search(checkend) == -1)){return false;}
    else {return true;}
}


var PageMembersRegister = function () {

    var tech_dict = {};

    var getTechnologies = function (api_service) {
        var technologies_names = [];
        $.when( callServiceGET(api_service+'/technologies', 'technologies') ).done(function(result) {
            $.each(result, function (i, item) {
                tech_dict[item.name] = item.id;
            });
            technologies_names = Object.keys(tech_dict);
            fillTechnologies(technologies_names);
        });

    };
    var fillTechnologies = function (technologies_names) {
        $('#technologies').textext({
            plugins: 'tags autocomplete suggestions',
            suggestions: technologies_names,
            html : {
                hidden: '<input type="hidden" name="technologies_names"/>'
            }
            }).bind('isTagAllowed', function (e, data) {
                if (technologies_names.indexOf(data.tag) == -1){
                    data.result = false;
                }
            });

    };
    var getCourses = function (api_service) {
        $.when(callServiceGET(api_service + '/courses')).done(function (result) {
            fill_select(result, 'course');
        });
    };
    var getEducations = function (api_service) {
        $.when(callServiceGET(api_service+'/educations')).done(function (result) {
            fill_select(result, 'education');
        });
    };
    var getOccupation = function (api_service) {
        $.when(callServiceGET(api_service+'/occupations')).done(function (result) {
            fill_select(result, 'occupation');
        });
    };
    var getVisas = function (api_service) {
        $.when(callServiceGET(api_service+'/visas')).done(function (result) {
            fill_select(result, 'visa');
        });
    };
    var getTimeExperience = function (api_service) {
        $.when(callServiceGET(api_service+'/experiences')).done(function (result) {
            fill_select(result, 'time_experience');
        });
    };
    var callServiceGET = function (url){
        return $.ajax({
                type: "GET",
                url: url
                }).done(function (data) {
                    return data;
                });
    };

    var fill_select = function (data, id_tag){
        $.each(data, function (i, item) {
            $('#'+id_tag).append($('<option>', {
                value: item.id,
                text : item.name
            }));
        });
    };

    return {
        init: function (api_service) {
            getTechnologies(api_service);
            getCourses(api_service);
            getEducations(api_service);
            getOccupation(api_service);
            getVisas(api_service);
            getTimeExperience(api_service);
            var $input = $('.datepicker').pickadate({
                formatSubmit: 'ddmmyyyy',
                hiddenSuffix: 'birth_date'
            });
            var picker = $input.pickadate('picker');
            picker.set('max', true);
        },
        save_member: function (api_service) {
            var experience_time_id = $('#time_experience option:selected').val();
            var course_id = $('#course option:selected').val();
            var education_id = $('#education option:selected').val();
            var visa_id = $('#visa option:selected').val();
            var occupation_area_id = $('#occupation option:selected').val();
            var working = $("input[id=is_working]:checked").val();
            var email = $('#email').val();
            if (!IsEmail(email)) {
                alert("Invalid Email");
                return;
            }
            working = working === 'on';
            var send_data = {
                "full_name": $('#full_name').val(),
                "short_name": $('#short_name').val(),
                "gender_id": parseInt($("input[name=group1]:checked").val()),
                "email": email,
                "phone": $('#phone').val(),
                "birth": $('input[name=birth_date]').val(),
                "about": $('#about').val(),
                "linkedin": $('#linkedin').val(),
                "github": $('#github').val(),
                "is_working": working,
                "experience_time_id": experience_time_id === "0" ? null : parseInt(experience_time_id),
                "course_id": course_id === "0" ? null : parseInt(course_id),
                "education_id": education_id === "0" ? null : parseInt(education_id),
                "visa_id": visa_id === "0" ? null : parseInt(visa_id),
                "occupation_area_id": occupation_area_id === "0" ? null : parseInt(occupation_area_id)
            };

            var select_technologies = JSON.parse($("input[name=technologies_names]").val());
            var technonlogy_ids = [];
            $.each(select_technologies, function (i, item) {
                technonlogy_ids.push(tech_dict[item])
            });
            send_data['technologies'] = JSON.stringify(technonlogy_ids);

            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": api_service + "/members",
                "method": "POST",
                "headers": {
                    "content-type": "application/json"
                },
                "processData": false,
                "data": JSON.stringify(send_data)
            }).done(function (response) {
                alert('ok');
                console.log(response);
            }).fail(function (error) {
                alert(error.responseText);
                console.log(error);
            });
        }
    }
}();


var PageMemberList = function () {

    var getMembers = function (api_service) {
        var visa_ids = [];
        var education_ids = [];
        var course_ids = [];
        var occupation_ids = [];
        var technology_ids = [];
        $.ajax({
            type: "GET",
            url: api_service+"/members",
            data: {
                "visa_ids": JSON.stringify(visa_ids),
                "education_ids": JSON.stringify(education_ids),
                "course_ids": JSON.stringify(course_ids),
                "occupation_ids": JSON.stringify(occupation_ids),
                'technology_ids': JSON.stringify(technology_ids)
            }
            }).done(function (data) {
                var members = data
            })
    };

    return {
        init: function (api_service) {
            getMembers(api_service);
        }
    }
}();
