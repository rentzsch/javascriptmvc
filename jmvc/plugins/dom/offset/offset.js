//From jQuery
if ( document.documentElement["getBoundingClientRect"] )
    MVC.Element.offset = function(element) {
	        if ( !element ) return { top: 0, left: 0 };
	        if ( element === element.ownerDocument.body ) return MVC.Element._offset.bodyOffset( element );
	        var box  = element.getBoundingClientRect(), doc = element.ownerDocument, body = doc.body, docElem = doc.documentElement,
	            clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
	            top  = box.top  + (self.pageYOffset || MVC.Element._offset.box_model && docElem.scrollTop  || body.scrollTop ) - clientTop,
	            left = box.left + (self.pageXOffset || MVC.Element._offset.box_model && docElem.scrollLeft || body.scrollLeft) - clientLeft;
	        return new MVC.Vector(left, top);
    };
else
    MVC.Element.offset = function(element) {
        if ( !element ) return { top: 0, left: 0 };
        if ( element === element.ownerDocument.body ) return MVC.Element._offset.bodyOffset( element );
        MVC.Element._offset.initialized || MVC.Element._offset.initialize();

        var elem = element, offsetParent = elem.offsetParent, prevOffsetParent = elem,
            doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
            body = doc.body, defaultView = doc.defaultView,
            prevComputedStyle = defaultView.getComputedStyle(elem, null),
            top = elem.offsetTop, left = elem.offsetLeft;

        while ( (elem = elem.parentNode) && elem !== body && elem !== docElem && elm !== doc ) {
            computedStyle = defaultView.getComputedStyle(elem, null);
            top -= elem.scrollTop;
            left -= elem.scrollLeft;
            if ( elem === offsetParent ) {
                top += elem.offsetTop;
                left += elem.offsetLeft;
                if ( MVC.Element._offset.doesNotAddBorder && !(MVC.Element._offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.tagName)) )
                    top  += parseInt( computedStyle.borderTopWidth,  10) || 0;
                    left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
                prevOffsetParent = offsetParent; offsetParent = elem.offsetParent;
            }
            if ( MVC.Element._offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" )
                top  += parseInt( computedStyle.borderTopWidth,  10) || 0;
                left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
            prevComputedStyle = computedStyle;
        }

        if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" )
            top  += body.offsetTop;
            left += body.offsetLeft;

        if ( prevComputedStyle.position === "fixed" )
            top  += Math.max(docElem.scrollTop, body.scrollTop);
            left += Math.max(docElem.scrollLeft, body.scrollLeft);

        return new MVC.Vector(left, top);
    };

MVC.Element._offset = {
    initialize: function() {
        if ( this.initialized ) return;
        var body = document.body, container = document.createElement('div'), innerDiv, checkDiv, table, rules, prop, bodyMarginTop = body.style.marginTop,
            html = '<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"cellpadding="0"cellspacing="0"><tr><td></td></tr></table>';

        rules = { position: 'absolute', top: 0, left: 0, margin: 0, border: 0, width: '1px', height: '1px', visibility: 'hidden' }
        for ( prop in rules ) container.style[prop] = rules[prop];

        container.innerHTML = html;
        body.insertBefore(container, body.firstChild);
        innerDiv = container.firstChild; 
        checkDiv = innerDiv.firstChild; 
        td = innerDiv.nextSibling.firstChild.firstChild;

        this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
        this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

        innerDiv.style.overflow = 'hidden'; innerDiv.style.position = 'relative';
        this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

        body.style.marginTop = '1px';
        this.doesNotIncludeMarginInBodyOffset = (body.offsetTop === 0);
        body.style.marginTop = bodyMarginTop;

        body.removeChild(container);
        this.initialized = true;
    },

    bodyOffset: function(body) {
        MVC.Element._offset.initialized || MVC.Element._offset.initialize();
        var top = body.offsetTop, left = body.offsetLeft;
        if ( MVC.Element._offset.doesNotIncludeMarginInBodyOffset )
            top  += parseInt( MVC.Element.get_style(body, 'marginTop'), 10 ) || 0;
            left += parseInt( MVC.Element.get_style(body, 'marginLeft'), 10 ) || 0;
        return new MVC.Vector(left, top);
    },
    box_model :!MVC.Browser.IE || document.compatMode == "CSS1Compat"
};


