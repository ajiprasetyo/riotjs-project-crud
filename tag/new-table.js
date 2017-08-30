riot.tag2('new-table', '<head> <title>Wellcome to riot js</title> </head> <div class="container"> <div class="row"> <div class="col-md-12"> <div class="table-responsive"> <body> <h1 class="text-primary text-center">News Report</h1> <div id="dialog-create"> <button id="btn-create" class="create btn btn-primary" data-title="Create">Create</button> </div> <table class="table table-bordred table-striped"> <thead id="orders"> <th>Title</th> <th>Content</th> <th>Created_At</th> <th>Update_At</th> <th>Edit</th> <th>Delete</th> </thead> </table> <div class="clearfix"></div> <ul class="pagination pull-right"> <li class="disabled"><a href="#"><span class="glyphicon glyphicon-chevron-left"></span></a></li> <li class="active"><a href="#">1</a></li> <li><a href="#">2</a></li> <li><a href="#">3</a></li> <li><a href="#">4</a></li> <li><a href="#">5</a></li> <li><a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a></li> </ul> </div> </div> </div> </div> <template id="order-template"> <tr> <td>{{title}}</td> <td>{{content}}</td> <td>{{created_at}}</td> <td>{{updated_at}}</td> <td><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="edit btn btn-primary btn-xs" data-title="Edit" data-id="{{id}}"><span class="glyphicon glyphicon-pencil"></span></button></p></td> <td><p data-placement="top" data-toggle="tooltip" title="Delete"><button class="delete btn btn-danger btn-xs" data-title="Delete" data-id="{{id}}"> <span class="glyphicon glyphicon-trash"></span></button></p></td> </tr> </template> <div id="dialog-edit"> <h3>Update data</h3> <form name="contactupdate" id="form-update"> <input class="edit" type="text" placeholder="title berita" id="titleupdate"> <input class="edit" type="text" placeholder="content berita" id="contentupdate"> <button id="btn-update">Update</button> </form> </div> <div id="create"> <h3>Input new data</h3> <form name="contact" id="frm"> <input class="form-control" type="text" placeholder="title berita" id="title"> <input class="form-control" type="text" placeholder="content berita" id="content"> <button class="btn btn-primary" id="add-data">Submit</button> </form> </div> </body>', 'new-table table,[data-is="new-table"] table,new-table td,[data-is="new-table"] td,new-table th,[data-is="new-table"] th{ border: 1px solid #ddd; text-align: left; } new-table table,[data-is="new-table"] table{ border-collapse: collapse; width: 100%; } new-table th,[data-is="new-table"] th,new-table td,[data-is="new-table"] td{ padding: 10px; text-align: left; } new-table #dialog-edit,[data-is="new-table"] #dialog-edit,new-table #create,[data-is="new-table"] #create{ display: none; } new-table .ui-widget-header,[data-is="new-table"] .ui-widget-header,new-table .ui-state-default,[data-is="new-table"] .ui-state-default,new-table ui-button,[data-is="new-table"] ui-button{ background:#b9cd6d; border: 1px solid #b9cd6d; color: #FFFFFF; font-weight: bold; } new-table #btn-create,[data-is="new-table"] #btn-create{ width: 130px; margin: 10px; margin-left: 0px; }', '', function (opts) {

    var idUpdate = 0;
    var $curTr = null;

    $(function () {
        var $dialogcreate = $('#dialog-create');
        var $orders = $('#orders');
        var $title = $('#title');
        var $content = $('#content');
        var contentTemplate = $('#order-template').html();

        function addContent(data) {
            $orders.append(Mustache.render(contentTemplate, data));
        }

        $.ajax({
            type: 'GET',
            url: 'https://rest-api.r10.co/articles',
            success: function (response) {
                var data = response.data.reverse();
                $.each(data, function (i, data) {
                    addContent(data);
                });
            },
            error: function () {
                alert('error loading json');
            }
        });

        $dialogcreate.delegate('.create', 'click', function () {
            $("#create").dialog();
        });
        $('#add-data').on('click', function () {
            event.preventDefault();
            var order = {
                title: $title.val(),
                content: $content.val(),
            };

            $.ajax({
                type: 'POST',
                url: 'https://rest-api.r10.co/articles',
                data: order,
                success: function (newContent) {
                    var content = newContent.data;
                    addContent(content);
                },
                error: function () {
                    alert('error saving data');
                }
            });

        });

        $orders.delegate('.edit', 'click', function () {
            $curTr = $(this).closest('tr');
            $("#dialog-edit").dialog();

            $.ajax({
                type: 'GET',
                url: 'https://rest-api.r10.co/articles/' + $(this).attr('data-id'),

                success: function (data) {
                    var content = data.data;
                    idUpdate = content.id;
                    $("#titleupdate").val(content.title);
                    $("#contentupdate").val(content.content);
                }
            });
        });

        $('#btn-update').on('click', function () {
            event.preventDefault();

            var newData = {

                title: $("#titleupdate").val(),
                content: $("#contentupdate").val(),
            };

            $.ajax({
                type: 'PUT',
                url: 'https://rest-api.r10.co/articles/' + idUpdate,
                data: newData,
                success: function (newContent) {
                    var content = newContent.data;
                    $curTr.remove();
                    addContent(content);
                },
                error: function () {
                    alert('error saving data');
                }
            });

        });

        $orders.delegate('.delete', 'click', function () {
            event.preventDefault();

            var $tr = $(this).closest('tr');

            $.ajax({
                type: 'DELETE',
                url: 'https://rest-api.r10.co/articles/' + $(this).attr('data-id'),
                success: function (data) {
                    $tr.remove();
                }
            });
        });

    });

});
