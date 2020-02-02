const Print = (e) => console.log(e)

class Cafe {

    public dish = null

    public AddCucambers() {
        this.dish += 'cucambers'
        return this
    }

    public AddTomatoes() {
        this.dish += 'tomatoes'
    }
    public AddSause() {
        this.dish += 'sauce'
        return this
    }
    public AddSpagetti() {
        this.dish += 'spagetti'
        return this
    }
    public ShowMyOrder() {
        return this.dish
    }

}

const CafeInstance = new Cafe()
CafeInstance.AddCucambers().AddSause().publicAddSpagetti()

Print(CafeInstance.dish)