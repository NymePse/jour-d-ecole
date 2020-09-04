//An Array with a max id
function SizedArray(length) {
    this.length = length;
    this.lastId = this.length - 1;
    this.full = false;
    this.array = new Array();
    
    //General functions
    //Check if the SizedArray is full. Returns true if so.
    this.isFull = function() {
        let check = true;
        this.array.forEach(function(value) {
            if(value == undefined)
                check = false;
            /*
            if(check == false)
                break;
            */
        });
        this.full = check;
        return check;
    }
    
    this.toString = function() {
        return "Size : " + this.length + ", Full : " + this.full + ", Array : " +this.array.toString();
    };
    
    this.empty = function() {
        this.array = new Array();
        this.full = false;
    }
    
    //Single value functions
    //Push value at the end of the Array. If it's complete, does nothing.
    this.push = function(val) {
        if(this.array[this.lastId] == undefined)
        {
            let posL = 0;
            let posM = this.lastId;
            let pos = Math.round(this.length / 2);
            
            let found = false;
            
            while(found == false)
            {                
                if(pos > 0 && this.array[pos - 1] == undefined)
                {
                    posM = pos - 1;
                    pos = Math.round((posM+posL) / 2);
                }
                else if(this.array[pos] == undefined)
                {
                    found = true;
                }
                else
                {
                    posL = pos + 1;
                    pos = Math.round((posM+posL) / 2);
                }
            }
            
            this.array[pos] = val;
        }
    }
    
    //Add value at the begining of the Array and swipe the rest to the right.
    this.addFirst = function(val) {
        let ex = this.array[0];
        let ac;
        for(let i = 1; i <= this.lastId; i++) 
        {
            ac = this.array[i];
            this.array[i] = ex;
            ex = ac;
        }
        this.array[0] = val;
    };
    
    //Add value at the end of the Array and swipe the rest to the left.
    this.addLast = function(val) {
        let ex = this.array[this.lastId];
        let ac;
        for(let i = this.lastId - 1; i >= 0; i--) 
        {
            ac = this.array[i];
            this.array[i] = ex;
            ex = ac;
        }
        this.array[this.lastId] = val;
    };
    
    //Insert value at position over existing one.
    this.copyOver = function(val, pos) {
        if(pos > this.lastId)
            throw new InsertAfterLastIDSizedArrayError();
        else
            this.array[pos] = val;
    }
    
    //Return true if the value is in the Array.
    this.includes = function(val) {
        return this.array.includes(val);
    };
    
    //Add value at the wanted position, slides values after it to the end.
    this.addSwipeRight = function(val, pos) {
        let ex = this.array[pos];
        let ac;
        for(let i = pos + 1; i <= this.lastId; i++)
        {
            ac = this.array[i];
            this.array[i] = ex;
            ex = ac;
        }
        this.array[pos] = val;
    };
    
    //Add value at the wanted position, slides values before it to the begining.
    this.addSwipeLeft = function(val, pos) {
        let ex = this.array[pos];
        let ac;
        for(let i = pos - 1; i >= 0; i--) 
        {
            ac = this.array[i];
            this.array[i] = ex;
            ex = ac;
        }
        this.array[pos] = val;
    };
    
    //Array of values functions
    //Insert array from position over existing values.
    this.copyArrayOver = function(ar, pos) {
        if(pos + ar.length > this.lastId)
            throw new InsertAfterLastIDSizedArrayError();
        else
        {
            for(let i = pos; i < pos + ar.length; i++)
                this.array[i] = ar[i];
        }
    }
    
    //Add Array at the begining and swipe the rest to the right.
    this.addFirstArray = function(ar) {
        if(ar.length > this.length)
            throw new BiggerArrayError(ar.length, this.length);
        else
        {
            let arSize = ar.length;
            for(let i = 0; i < arSize; i++)
                this.addSwipeRight(ar[i], i);
        }
    };
    
    //Add Array at the end and swipe the rest to the left.
    this.AddLastArray = function (ar) {
        if(ar.length > this.length)
            throw new BiggerArrayError(ar.length, this.length);
        else
        {
            let arSize = ar.length;
            for(let i = this.lastId; i > this.lastId - arSize; i++)
                this.addSwipeLeft(ar[i], i);
        }
    };
}

//--------------------------------------------------------------------------------------------//

//ERRORS
//SizedArray is full
class FullSizedArrayError extends Error {
  constructor(SAsize, Asize) {
    // Passer les arguments restants (incluant ceux spécifiques au vendeur) au constructeur parent
    super("Error : SizedArray is full.");

    // Maintenir dans la pile une trace adéquate de l'endroit où l'erreur a été déclenchée (disponible seulement en V8)
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, FullSizedArrayError);
    }
    this.name = 'FullSizedArrayError';
    this.date = new Date();
  }
}

//Array to push too big
class BiggerArrayError extends Error {
  constructor(SAsize, Asize) {
    // Passer les arguments restants (incluant ceux spécifiques au vendeur) au constructeur parent
    super("Error : Array is " + Asize + " long, SizedArray is only " + SAsize + ".");

    // Maintenir dans la pile une trace adéquate de l'endroit où l'erreur a été déclenchée (disponible seulement en V8)
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, BiggerArrayError);
    }
    this.name = 'BiggerArrayError';
    this.date = new Date();
  }
}

//Array to push too big
class InsertAfterLastIDSizedArrayError extends Error {
  constructor() {
    // Passer les arguments restants (incluant ceux spécifiques au vendeur) au constructeur parent
    super("Error : Tried to insert values after the SizedArray last ID.");

    // Maintenir dans la pile une trace adéquate de l'endroit où l'erreur a été déclenchée (disponible seulement en V8)
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, InsertAfterLastIDSizedArrayError);
    }
    this.name = 'InsertAfterLastIDSizedArrayError';
    this.date = new Date();
  }
}