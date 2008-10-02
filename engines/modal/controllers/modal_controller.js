
/**
 * Used for Modal alert and prompts
 *<pre>ModalController.alert({text: "hi", callback: callback})
ModalController.prompt({text: "question?", callback: callback})
</pre>
 */
ModalController = MVC.Controller.extend('modal',
/*@static*/
{
    /**
     * Shows an Alert box
     * @param {Object} value text you want shown
     * @param {Object} callback calls this function when OK or close X is clicked
     */
    alert: function(value, callback){
        var param = {text: value, callback: callback}
        this.dispatch(this, 'alert', param);
        this.callback = callback;
    },
    /**
     * Shows a prompt box.  Callsback with the value of the input box if OK is pressed, false if otherwise.
     * @param {Object} value text you want shown
     * @param {Object} callback calls this function when OK, Cancel or close X is clicked. 
     */
    prompt: function(value, callback){
        var param = {text: value, callback: callback}
        this.dispatch(this, 'prompt', param);
        this.callback = callback;
    }
},
/*@Prototype*/
{
	/*
	 * Called as a user begins to drag the prompt box.  Checks if the mouse is inside the top bar.  
	 * If it is, continue dragging by returning true.
	 */
	dragstart: function(params){
		// only drag if we clicked the top bar
		if (!MVC.Position.within(MVC.Query('#modal .modalTop')[0], 
			params.event.clientX, params.event.clientY))
				return false;
		return true;
	},
	/*
	 * Called if the page is scrolled to keep the modal box in the same position on the page.
	 */
    scroll : function(){
        var el = document.getElementById(this.Class.className);
        if(el.style.display != "none") el.style.top = MVC.Dimensions().scroll_top; 
    },
	/*
	 * Called on page load to set up modal boxes by creating a containing div.
	 */
    load : function(){
        var el = document.createElement('div');
        el.id = this.Class.className;
        el.className = "modalContainer";
        el.style.display = 'none';
        document.body.appendChild(el);
        //this.render({to: this.Class.className})
    },
	/*
	 * Call this to render an alert box.
	 * @param {Object} param object containing a text attribute which is the content of the box
	 */
    alert : function(param){

        this.text = param.text
        this.render({to: this.Class.className});
		$E(this.Class.className).style.display="block";
        $E('MODAL_OK').focus();
    },
	/*
	 * Called when OK is clicked.  Calls the callback and closes the box.
	 */
    "#MODAL_OK click" : function(){
        this.close_and_callback(null);
    },
	/*
	 * Called when Cancel is clicked.  Closes the box.
	 */
    ".close click" : function(){
        this.close_and_callback(null);
    },
	/*
	 * Places the box in the center of the page.
	 */
	recenter: function(){
		$E(this.Class.className).style.top='';
		$E(this.Class.className).style.left='';
	},
	/*
	 * Call this to render an prompt box.
	 * @param {Object} param object containing a text attribute which is the content of the box
	 */
    prompt : function(param){
		this.recenter();
        window.onscroll = function () { 
             document.getElementById("modal").style.top = document.body.scrollTop; 
        };
        this.text = param.text
        this.render({to: this.Class.className});
		$E(this.Class.className).style.display="block";
        $E('MODAL_PROMPT').focus();
    },
	/*
	 * Called when the form in the prompt modal box is submitted.  
	 * Kills the event, determines which button was pressed (OK or Cancel) and behaves accordingly.
	 */
    "#modalBody submit" : function(params){
        //prompt submit
        var p = params;
        params.event.kill();
        var on = params.event.explicitOriginalTarget ?  params.event.explicitOriginalTarget : params.event.target
        
        if(on.id == "MODAL_CANCEL")
            this.close_and_callback(null);
        else{
            this.clicked_ok(params);
        }
    },
	/*
	 * Called when a user clicks ok in the prompt box.  Closes the box and calls back with the 
	 * text that was entered.
	 */
	clicked_ok: function(params) {
		this.close_and_callback( $E('MODAL_PROMPT').value);
	},
	/*
	 * Closes the modal box and calls the given callback with the data passed
	 * @param {String} data data to pass to the callback function
	 */
    close_and_callback : function(data){
        document.getElementById(this.Class.className).style.display = "none";
        if(this.Class.callback)
            this.Class.callback(data);
    }
});

/*
 * Simple class to deal with the different browser methods for keeping track of document, 
 * window, and scroll dimensions.  Used throughout the application to make UI calculations.
 * @return {Object} Object with dimension information
 */
MVC.Dimensions = function(){
     var de = document.documentElement, 
         st = window.pageYOffset ? window.pageYOffset : de.scrollTop,
         sl = window.pageXOffset ? window.pageXOffset : de.scrollLeft;
     
     var wh = window.innerHeight ? window.innerHeight : de.clientHeight, 
         ww = window.innerWidth ? window.innerWidth :de.clientWidth;
     if(wh == 0){
         wh = document.body.clientHeight;
         ww = document.body.clientWidth;
     }
     
     return {
         window_height: wh,
         window_width: ww,
         document_height: MVC.Browser.IE ? document.body.offsetHeight : de.offsetHeight,
         document_width: MVC.Browser.IE ? document.body.offsetWidth :de.offsetWidth,
         scroll_left: sl,
         scroll_top: st,
         window_right: sl+ ww,
         window_bottom: st+ wh
     }
}