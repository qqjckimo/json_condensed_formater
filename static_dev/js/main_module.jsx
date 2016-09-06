require(['alertify_css']);
var alertify = require('alertify');
var React = require('react');
var ReactDOM = require('react-dom')
var JsonPropPrettify = require('./json_prop_prettify.js');

var placeholder;

var MainModule = React.createClass({
	getInitialState: function() {
	    return {
	        json_properties: []  
	    };
	},
	componentDidMount: function() {
		placeholder = document.createElement("li");
		placeholder.className = "placeholder";

		// Create a new style tag
		var style = document.createElement("style");

		// Append the style tag to head
		document.head.appendChild(style);

		// Grab the stylesheet object
		sheet = style.sheet

		// Use addRule or insertRule to inject styles
		sheet.addRule('li.placeholder','background: rgb(255,240,120)');
		sheet.insertRule('li.placeholder:before { content: "Drop here"; color: rgb(225,210,90); }', 0);

		//
		sheet.insertRule('ul {list-style: none; margin: 0; padding: 0}', 0);
		sheet.insertRule('li {padding: 6px; background: #eee}', 0);
	},
	_get_porps_list: function() {
        var props_str = this.refs.cond_props_area.value;
        if(props_str.length == 0) {
        	return [];
        }
        return props_str.split(',').map(function(ele){return ele.trim();});
    },
    _gen_sortable_property_list: function(json_str){
    	var dict = JSON.parse(json_str);
    	var props = [];
    	for(var key in dict) {
    		props.push(key);
    	}
    	this.setState({json_properties: props});
    },
    _format_json_str: function(json_str) {
    	var next_str = JSON.stringify(JSON.parse(json_str), null, 4);

        this._get_porps_list().forEach(function(prop, p_index){
            try{
                next_str = JsonPropPrettify.format_list_prop(next_str, prop);    
            } catch (e) {
                alertify.warning(e.message);
            }
        });
    	return next_str;
    },
    onDragStart: function(e) {
    	this.dragged = e.currentTarget;
	    e.dataTransfer.effectAllowed = 'move';

	    // Firefox requires calling dataTransfer.setData
	    // for the drag to properly work
	    e.dataTransfer.setData("text/html", e.currentTarget);
	},
  	onDragEnd: function(e) {
	    this.dragged.style.display = "block";
	    this.dragged.parentNode.removeChild(placeholder);

	    // Update state
	    var data = this.state.json_properties;
	    var from = Number(this.dragged.dataset.id);
	    var to = Number(this.over.dataset.id);
	    if(this.nodePlacement == "after") to++;
	    if(from < to) to--;
	    data.splice(to, 0, data.splice(from, 1)[0]);
	    this.setState({json_properties: data});

	    var json_str = this.refs.json_str_area.value;
        if(json_str.length == 0) {
        	return;
        }

	    // update json str
	    var next_json_str = "{";
	    var cur_json_dict = JSON.parse(json_str);
	    data.forEach(function(key, k_index, k_array){
	    	var obj = {};
	    	obj[key] = cur_json_dict[key];
	    	var obj_str = JSON.stringify(obj);
	    	next_json_str += obj_str.substr(1, obj_str.length-2);
	    	
	    	if(k_index != (k_array.length-1)){
	    		next_json_str += ", ";
	    	}
	    });
	    next_json_str += "}";

	    this.refs.json_str_area.value = this._format_json_str(next_json_str);
	},
	onDragOver: function(e) {
	    e.preventDefault();
	    this.dragged.style.display = "none";
	    if(e.target.className == "placeholder") return;
	    
	    this.over = e.target;
	    var relY = e.clientY - this.over.offsetTop;
		var height = this.over.offsetHeight / 2;
		var parent = e.target.parentNode;

		if(relY > height) {
			this.nodePlacement = "after";
			parent.insertBefore(placeholder, e.target.nextElementSibling);
		}
		else if(relY < height) {
			this.nodePlacement = "before";
			parent.insertBefore(placeholder, e.target);
		}
	},
    onFormatClick: function(){
        var json_str = this.refs.json_str_area.value;
        if(json_str.length == 0) {
        	return;
        }

        this.refs.json_str_area.value = this._format_json_str(json_str);
    },
    onJSONChange: function(){
    	var json_str = this.refs.json_str_area.value;
        if(json_str.length == 0) {
        	return;
        }
        this._gen_sortable_property_list(json_str);
    },
    render: function() {
        var json_str_area_style = {"verticalAlign": "top"};
        var cond_props_area_style = {"verticalAlign": "top"};
        
        return (
            <div>
            	<table>
            		<tbody>
            			<tr>
            				<td style={json_str_area_style}>
            					<div className="json_str_area">
		                            <h5>Input JSON string</h5>
		                            <textarea ref="json_str_area" rows="35" cols="70" onChange={this.onJSONChange}></textarea>
		                        </div>
            				</td>
            				<td style={cond_props_area_style}>
            					<div className="cond_props_area">
		                            <h5>Porperty name of list to be condensed, seperate with "," </h5>
		                            <textarea ref="cond_props_area" rows="5" cols="35"></textarea>
		                        </div>
		                        <div>
		                            <button type="button" onClick={this.onFormatClick}> Format </button>
		                        </div>
		                        <div className="sort_props_area">
		                            <h5>Drag & Drop to sort properties</h5>
		                            <ul id="sortable_prop_list" onDragOver={this.onDragOver}>
		                            	{this.state.json_properties.map(function(item, i) {
									        return (
									          <li
									            data-id={i}
									            key={i}
									            draggable="true"
									            onDragEnd={this.onDragEnd}
									            onDragStart={this.onDragStart}
									          >
									            {item}
									          </li>
									        )
									    }, this)}
		                            </ul>
		                        </div>
            				</td>
            			</tr>
            		</tbody>
            	</table>
            </div>
        );
    }
});

ReactDOM.render(<MainModule />, document.getElementById('content'));