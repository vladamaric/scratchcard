function ScratchCard(){ 
    this.MOUSE_DOWN   = false; 
    this.resources = {
      "brush_sprite":"brush.png",
      "censor_image":"censor.png",
      "prize_images":[
                        "censor.png",
                        "censor.png",
                        "censor.png",
                        "censor.png",
                        "censor.png",
                        "censor.png",
                        "censor.png",
                        "censor.png"
                      ]
      
    }
    this.resource_objects = {

    } 
    this.prizes_path              = "res";
    this.images_path              = "images";
    this.censors_path             = "res";
    this.total_loaded_resources   = 0;
    this.total_resources          = 0; 
    this.loader_hang_time         = 1000;

    this.prize_table              = null;
    this.ctx                      = null;

    this.set_canvas = function(){
      this.ctx = this.canvas.getContext("2d"); 

    }

    this.set_resources = function(){
      for(r in this.resources){
        if(Array.isArray(this.resources[r])){
          for(var i=0;i<this.resources[r].length;i++){
            this.total_resources++;
          }
        } else if (typeof this.resources[r] === 'object') {
          for(var i in this.resources[r]){
            this.total_resources++;
          }
        } else {
          this.total_resources++;
        }
      }   
    }

    this.set_dom = function(){
      this.prize_table = document.getElementsByTagName("table")[0];
      this.prize_table.style["user-select"]           = "none";
      this.prize_table.style["-webkit-user-select"]   = "none";
      this.prize_table.style["-khtml-user-select"]    = "none";
      this.prize_table.style["-moz-user-select"]      = "none";
      this.prize_table.style["-ms-user-select"]       = "none";
      this.canvas = document.createElement("canvas");
      this.canvas.width = 1200;
      this.canvas.height = 450;
      this.canvas.style.cssText = "background-color:transparent;position:absolute;cursor:pointer;"
      this.loader = document.createElement("div");
      this.loader.style.cssText = "background-color:yellow;color:red;position:absolute;text-align:center;"; 
      this.prize  = document.createElement("div");
      this.prize.style.cssText = "background-color:green;position:absolute;font-size:1.4em;text-align:center;";
      this.prize_table.parentNode.insertBefore(this.canvas,this.prize_table) 
      this.prize_table.parentNode.insertBefore(this.loader,this.prize_table) 
      
      this.set_canvas_size();
    } 

    /* Event handlers */
    this.window_resize_handler    = (evt)=>{
      this.set_canvas_size()
    }

    this.mouse_down_handler       = (evt)=>{
      this.clear_area(evt) 
      this.MOUSE_DOWN = true; 
      this.check_completition();
    }

    this.mouse_up_handler         = (evt)=>{
      this.MOUSE_DOWN = false; 
    }

    this.mouse_move_handler       = (evt)=>{
      if(this.MOUSE_DOWN){
        this.clear_area(evt);
        this.check_completition();
      }
    };  

    this.resource_loaded_handler  = (evt)=>{
        console.debug(evt);
        this.show_loader();
    }

    this.resources_fully_loaded   = ()=>{

    }

    this.clear_handlers = function(){
      this.canvas.removeEventListener('mousedown',  this.mouse_down_handler);
      this.canvas.removeEventListener('mouseup',    this.mouse_up_handler);
      this.canvas.removeEventListener('mousemove',  this.mouse_move_handler);
    }

    this.set_events = function(){
      window.removeEventListener('resize',          this.window_resize_handler);
      window.addEventListener('resize',             this.window_resize_handler);  
      this.canvas.addEventListener('mousedown',     this.mouse_down_handler); 
      this.canvas.addEventListener('mouseup',       this.mouse_up_handler); 
      this.canvas.addEventListener('mousemove',     this.mouse_move_handler);
    } 

    this.get_filled_pixels = function(stride) {
      if (!stride || stride < 1) { stride = 1; } 
      var pixels   = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
          pdata    = pixels.data,
          l        = pdata.length,
          total    = (l / stride),
          count    = 0;  
      for(var i = count = 0; i < l; i += stride) {
        if (parseInt(pdata[i]) === 0) {
          count++;
        }
      }
      return Math.round((count / total) * 100);
  } 

  this.set_canvas_size = function(){
      let prize_table_offset_width  = this.prize_table.offsetWidth;
      let prize_table_offset_height = this.prize_table.offsetHeight;
      this.loader.style.width       = prize_table_offset_width + "px";  
	  let offset = (prize_table_offset_height / 2) - 15; 
      this.loader.style.height      = (prize_table_offset_height - offset) + "px";  
      this.loader.style.paddingTop  = offset + 'px';
      this.canvas.style.width       = prize_table_offset_width + "px";
      this.canvas.style.height      = prize_table_offset_height + "px";
      this.prize.style.width        = prize_table_offset_width + "px";
      this.prize.style.height       = prize_table_offset_height - offset + "px";
      this.prize.style.paddingTop   = offset + 'px';
  } 

  this.set_brush = function(){
    this.brush = new Image();
    this.brush.src = this.images_path + "/" + this.resources.brush_sprite; 
  } 

  

  this.load_resources = function(){
      /* Load brush */
      this.resource_objects.brush_sprite  = new Image();
      this.resource_objects.brush_sprite.onload = this.resource_loaded_handler;
      this.resource_objects.brush_sprite.src = this.images_path + "/" + this.resources.brush_sprite;
      this.resource_objects.censor_image  = new Image();
      this.resource_objects.censor_image.onload = this.resource_loaded_handler;
      this.resource_objects.censor_image.src = this.censors_path + "/" + this.resources.censor_image;
      this.resource_objects.prize_images = []; 
      for(let i=0;i<this.resources.prize_images.length;i++){
		  console.debug("HHH:",ScratchCard.instance.prize_table.offsetHeight);
        this.resource_objects.prize_images[i] = new Image();
        this.resource_objects.prize_images[i].src = this.prizes_path + "/" + this.resources.prize_images[i]
         this.resource_objects.prize_images[i].onload = this.resource_loaded_handler;
      } 
  }

  this.show_prize = function(){
    this.prize_table.parentNode.insertBefore(this.prize,this.prize_table);
    this.prize.style.color = "white"; 
    this.prize.innerHTML = "YOU WON!"
    setTimeout(()=>{
      this.prize.remove();
      this.clear_handlers();
    },this.loader_hang_time*2)
  }
    
  this.show_loader = function(){ 
    if(this.total_loaded_resources>=this.total_resources){
      return;
    }
    this.total_loaded_resources++; 
    let total = (100 / this.total_resources) * this.total_loaded_resources; 
    console.debug(total);
    this.loader.innerHTML = total.toFixed() + "%"
    this.set_canvas_size();
    if(this.total_loaded_resources >= this.total_resources){
      if(this.resources_fully_loaded!=null){
        this.resources_fully_loaded();
      } 
      setTimeout(()=>{
        this.prize_table.parentNode.removeChild(this.loader);
      },this.loader_hang_time);
    }
  }

  this.draw_grid = function(){  
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    let offset = this.canvas.width / 3
    for(var i=1,col=0;i<10;i++){
        this.ctx.drawImage(this.resource_objects.censor_image,this.canvas.width/3*(i%3)+10,(this.canvas.height/3)*col+5);
        if(i > 0 && (i % 3) == 0){
          col++;
        }
    } 
    this.set_canvas_size() 
  } 

  this.draw_prizes = function(){  
    var rows = this.prize_table.getElementsByTagName("td");
    for(var i=0;i<rows.length;i++){
      var ind = Math.round(Math.random()*(this.resource_objects.prize_images.length-1))  
      rows[i].getElementsByTagName("img")[0].src = this.resource_objects.prize_images[ind].src;  
    } 
    this.set_canvas_size();
  }

  

  this.check_completition = function(){
    if(this.get_filled_pixels(32)>=99){
      this.show_prize();
    }
  }
   
  this.clear_area = function(evt){
    var rect = this.canvas.getBoundingClientRect();
    let scaleX = this.canvas.width / rect.width;
    let scaleY = this.canvas.height / rect.height;
    let x = (evt.clientX - rect.left)  * scaleX;
    let y = (evt.clientY -  rect.top)  * scaleY; 
    this.ctx.globalCompositeOperation = 'destination-out'; 
    this.ctx.drawImage(this.resource_objects.brush_sprite,x-30,y-30) 
  } 
  }

  ScratchCard.run = function(){
      ScratchCard.instance = new ScratchCard();
      ScratchCard.instance.set_dom();
      ScratchCard.instance.set_canvas();
      ScratchCard.instance.set_resources();
      ScratchCard.instance.load_resources(); 
      ScratchCard.instance.resources_fully_loaded = ()=>{
          ScratchCard.instance.draw_grid();
          ScratchCard.instance.draw_prizes();
          ScratchCard.instance.clear_handlers();
          ScratchCard.instance.set_events();
      }
  }

  ScratchCard.run();