var EDITION_GRID_HEIGHT = 300;
var EDITION_GRID_WIDTH = 300;
var MAX_CELL_SIZE = 100;
var LOG_LIST = [];
var actions;
var currentAction = 0;
var TASKLIST;
var defaultGridData = new Array();
for (var i = 0; i < defaultGridData.length; i++) {
    defaultGridData.push(new Array(3))
    for (var j = 0; j < defaultGridData.length; j++) {
        defaultGridData[i].push(0);
    }
}
var defaultGrid = new Grid(3,3);


function next() {
    currentAction = Math.min(currentAction+1, actions.length-1);
    getGrid();
}

function prev() {
    currentAction = Math.max(0, currentAction-1);
    getGrid();
}

function get_input_output_grid(input_log_task, output_log_task){
    fillJqGridWithData($('#input_grid'), input_log_task);
    fillJqGridWithData($('#output_grid'), output_log_task);
    fitCellsToContainer($('#input_grid'), input_log_task.height, input_log_task.width, 150, 150);
    fitCellsToContainer($('#output_grid'), output_log_task.height, output_log_task.width, 150, 150);
}


function filltest(id, input_task_grid, output_task_grid){
    var pairSlot = $('#pair_preview_' + id);
    var inputSlot = pairSlot.find('.input_pair');
    var outputSlot = pairSlot.find('.output_pair');
    if (!pairSlot.length) {
        // Create HTML for pair.
        pairSlot = $('<div id="pair_preview_' + id + '" class="pair_preview" index="' + id + '"></div>');
        var inputSlot = $('<div class="input_pair"></div>');
        var arrow = $('<div id="demo_arrow" class="arrow"><h1>&#8594;</h1></div>');
        var outputSlot = $('<div class="output_pair"></div>');
        inputSlot.appendTo(pairSlot);
        arrow.appendTo(pairSlot);
        outputSlot.appendTo(pairSlot);
        pairSlot.appendTo('#testview');
    }
    var jqInputGrid = inputSlot.find('.input_preview');
    if (!jqInputGrid.length) {
        jqInputGrid = $('<div class="input_preview"></div>');
        jqInputGrid.appendTo(inputSlot);
    }

    var jqOutputGrid = outputSlot.find('.output_preview');
    if (!jqOutputGrid.length) {
        jqOutputGrid = $('<div class="output_preview"></div>');
        jqOutputGrid.appendTo(outputSlot);
    }
    fillJqGridWithData(jqInputGrid, input_task_grid);
    fitCellsToContainer(jqInputGrid, input_task_grid.height, input_task_grid.width, 150, 150);
    fillJqGridWithData(jqOutputGrid, output_task_grid);
    fitCellsToContainer(jqOutputGrid, output_task_grid.height, output_task_grid.width, 150, 150);

}

function get_test_grid(input_test_task, output_test_task){
    for (var i = 0; i < input_test_task.length; i++) {  
        var input_task_grid = input_test_task[i];
        var output_task_grid = output_test_task[i];
        filltest(i, input_task_grid, output_task_grid);

}
}

function getGrid() {
    var overview_box = document.getElementById("active"); 
    overview_box.style = "background-color:rgb(224 223 223); color: #383838";
    $('#action').show();
    $('.grid').show();
    gridData = actions[currentAction]['grid'];
    act = actions[currentAction]['action'];
    tool = act['tool'];
    symbol = act['symbol'];
    row = act['row'];
    col = act['col'];
    height = act['height'];
    width = act['width'];
    selected = act['selected_cells'];
    rowChange = act['row_change'];
    colChange = act['col_change'];
    submit = actions[currentAction]['submit'];
    time = actions[currentAction]['time'];
    currentGrid = convertSerializedGridToGridObject(gridData);
    fillJqGridWithData($('#main_grid'), currentGrid);
    fitCellsToContainer($('#main_grid'), currentGrid.height, currentGrid.width, 400, 400);
    
    var tool_description = "";
    var description = "";
    tool_description += `${tool}\n`;
    if (symbol) {
        description += `symbol: ${symbol}\n`;
    }
    if (row) {
        description += `row: ${row}\n`;
    }
    if (col) {
        description += `col: ${col}\n`;
    }
    if (height) {
        description += `height: ${height}\n`;
    }
    if (width) {
        description += `width: ${width}\n`;
    }
    if (rowChange) {
        description += `row_change: ${rowChange}\n`;
    }
    if (colChange) {
        description += `col_change: ${colChange}\n`;
    }
    if (time) {
        description += `time: ${time}\n`;
    }
    if (submit) {
        description += `submit: ${submit}\n`;
    }

    document.getElementById('action_description').innerHTML = description
    document.getElementById('action_tool').innerHTML = tool_description

    copyPasteData = act['copy_paste_data'];
    $('.ui-selected').each((i, cell) => $(cell).removeClass('ui-selected'));
    if (copyPasteData) {
        copyPasteData.forEach(function(cell) {
            r = cell[0];
            c = cell[1];
            source = cell[3];
            if (!source) {
            } else {
                $('#input_grid').find(`[x=${r}][y=${c}]`).addClass('ui-selected');
            }
        })
    }
   
    $('#active').click(function (e) { 
        $('#overview_page').show(); 
        $('#action').hide();
        $('.grid').hide();
        var overview_box = document.getElementById("active"); 
        overview_box.style = "background-color:rgb(188 188 188); color:black";
    }); 
}

function loadLog(id, task, user) {
    $('#show_grid').show();
    var task_evaluate = sessionStorage.getItem('task_name_test');
    currentAction = 0;
    selected = LOG_LIST.filter(log => log[0] == id);
    if (!selected.length) {
        return;
    }
    matching_task = TASKLIST.filter(t => t['task_name'] == task_evaluate);
    if (matching_task.length) {
        content = JSON.parse(matching_task[0]['content']);
        test = content['test']
        input = test[0]['input'];
        output = test[0]['output'];
        INPUT_GRID = convertSerializedGridToGridObject(input);
        OUTPUT_GRID = convertSerializedGridToGridObject(output);
    }
    currentLog = JSON.parse(selected[0][1]);
    actions = currentLog['action_sequence'];
    getGrid();
    $('#overview_page').hide();
    var overview_box = document.getElementById("active"); 
    overview_box.style = "background-color:rgb(224 223 223); color: #383838";
}


function loadInputOutput(id, task, user) {
    var task_evaluate = sessionStorage.getItem('task_name_test');
    currentAction = 0;
    selected = LOG_LIST.filter(log => log[0] == id);
    if (!selected.length) {
        return;
    }
    matching_task = TASKLIST.filter(t => t['task_name'] == task_evaluate);
    if (matching_task.length) {
        content = JSON.parse(matching_task[0]['content']);
        test = content['test']
        
    }
    currentLog = JSON.parse(selected[0][1]);
    actions = currentLog['action_sequence'];
    getGrid();
}


function display_current_task(current_task_name){
    document.getElementById('current_task_name').innerHTML = (
        current_task_name
    );
}

$(window).load(function () {
    $('#overview_page').show();
    $('#show_grid').hide();
    var overview_box = document.getElementById("active"); 
    overview_box.style = "background-color:rgb(188 188 188); color:black";
    var task_evaluate = sessionStorage.getItem('task_name_test');
    var input_log_task = sessionStorage.getItem('log_input_grid');
    var output_log_task = sessionStorage.getItem('log_output_grid');
    var input_test_task = sessionStorage.getItem('testinputpairs');
    var output_test_task = sessionStorage.getItem('testoutputpairs');
    input_log_task = JSON.parse(input_log_task);
    output_log_task = JSON.parse(output_log_task);
    input_test_task = JSON.parse(input_test_task);
    output_test_task = JSON.parse(output_test_task);
    console.log(input_test_task)
    console.log(input_test_task.length)
    console.log(output_test_task)

    $.getJSON(
        "/log_db"
    ).done(function (data, task_name) {
        var LOGS = data;
        // console.log(LOGS)
        var LOGS_FILTERED = LOGS.filter(t => t['task_id'] == task_evaluate);
        cnt = 0
        LOGS_FILTERED.forEach(function(log) {
            log_item = $(`<a id = "trace_menu" onclick='loadLog("${log['id']}", "${log['task_id']}", "${log['user_id']}")'>trace_${cnt}_${log['user_id']}</a>`);
          
                log_item.appendTo($('#menu'));
                LOG_LIST.push([log['id'], log['action_sequence']]);
                cnt += 1
            
        })
        document.getElementById('menu').scrollTop = -document.getElementById('menu').scrollHeight;
    })
    $.getJSON(
        "/tasklist"
    ).done(function (data) {
        TASKLIST = data;
    })
    display_current_task(task_evaluate);
    get_input_output_grid(input_log_task, output_log_task);
    get_test_grid(input_test_task, output_test_task)

})

$(document).ready(function () {
    $('body').keydown(function (event) {
        if (event.which == 37) {
            prev();
        }
        if (event.which == 39) {
            next();
        }
    })
})

