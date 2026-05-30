//mainly reference from: https://p5js.org/reference/#/p5.Oscillator
class Rectangle
{
    constructor(x, y, width, height, isFlat, midiValue, keycode)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isFlat = isFlat;
        this.sibilingFlat = [];
        this.playing = false;
        this.osc = new p5.TriOsc();
        this.midiValue = midiValue;
        this.osc.freq(midiToFreq(this.midiValue));
        this.clickedBefore = false;
        this.pressedBefore = false;
        this.keyCode = keycode;
    }
    
    draw()
    {
        if (this.isFlat)
        {
            fill("black")
        }
        else
        {
            fill("white");
        }
        rect(this.x, this.y, this.width, this.height);
    }
    
    changeColor()
    {
        fill("blue");
        rect(this.x, this.y, this.width, this.height);
    }
    
    addSibilingFlat(key)
    {
        this.sibilingFlat.push(key);
    }
    
    isAbove()
    {
        if (!this.isFlat)
        {
            for (let i = 0; i < this.sibilingFlat.length; i++)
            {
                if (this.sibilingFlat[i].isAbove())
                {
                    return false;
                }
            }
        }
        if (this.x < mouseX && mouseX < this.x + this.width && this.y < mouseY && mouseY < this.y + this.height)
        {
            return true;
        }
    }
    
    isClicked()
    {
        if (mouseIsPressed && this.isAbove())
        {
            this.clickedBefore = true;
            return true;
        }
        return false;
    }
    
    isPressed()
    {
        if (pressing.includes(this.keyCode))
        {
            this.pressedBefore = true;
            return true;
        }
        
        return false;
    }
    
    checkRelease()
    {
        if (this.clickedBefore && (!mouseIsPressed && this.isAbove() || mouseIsPressed && !this.isAbove()))
        {
            this.osc.amp(0, reverb);
            this.playing = false;
            this.clickedBefore = false;
        }
    }
    
    checkUnpressed()
    {
        if (this.pressedBefore && !keyIsPressed)
        {
            this.osc.amp(0, reverb);
            this.playing = false;
            this.pressedBefore = false;
        }
    }
    
    play()
    {
        if (!this.playing)
        {
            this.playing = true;
            this.osc = new p5.TriOsc();
            this.osc.freq(midiToFreq(this.midiValue));
            this.osc.start();
            
        }
        else
        {
            this.osc.amp(volume, 0.01);
        }
        
    }
    
    downOctave()
    {
        let tmp = this.osc;
        this.osc = new p5.TriOsc();
        this.midiValue -= 12;
        this.osc.freq(midiToFreq(this.midiValue));
        tmp.amp(0, reverb);
        
    }
    
    upOctave()
    {
        let tmp = this.osc;
        this.osc = new p5.TriOsc();
        this.midiValue += 12;
        this.osc.freq(midiToFreq(this.midiValue));
        tmp.amp(0, reverb);
    }
}