var PageMembers = function () {

    var members;
    var educations;
    var visas;
    var courses;
    var technologies_list = [];
    var time_experience;
    var occupations;

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
                members= data
            })
    };
    var getTechnologies = function (api_service) {
        $.when( callServiceGET(api_service+'/technologies', 'technologies') ).done(function(result) {
            var technologies = [];
            $.each(result, function (i, item) {
                technologies.push(item.name);
                technologies_list.push(item)
            });

            $('#technologies').textext({
                plugins: 'tags autocomplete suggestions',
                suggestions: technologies,
                html : {
                    hidden: '<input type="hidden" name="technologies_names"/>'
                }
                }).bind('isTagAllowed', function (e, data) {
                    if (technologies.indexOf(data.tag) == -1){
                        data.result = false;
                    }
                });
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
                value: item.value,
                text : item.name
            }));
        });
    };

    return {
         init: function (api_service) {
             getMembers(api_service);
             getTechnologies(api_service);
             getCourses(api_service);
             getEducations(api_service);
             getOccupation(api_service);
             getVisas(api_service);
             getTimeExperience(api_service);
         }
     }
}();
