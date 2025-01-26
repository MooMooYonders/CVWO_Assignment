import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

type FilterProps = {
    value: string;
    handleChange: (event: SelectChangeEvent<string>) => void;
    options: string[]
}

const Filter: React.FC<FilterProps> = ({value, handleChange, options}) => {

    return (
        <FormControl sx={{
            width: "20%",
            padding: 2,
            minWidth: "100px",
            maxWidth: "150px",
            paddingTop: 3,
            paddingLeft: 2.5
        }}>
            <InputLabel 
                id="dropdown-label"
                sx={{ fontSize: "0.9rem", top: "17px", left: "11px" }}
            >
                Filter By
            </InputLabel>
            <Select
                labelId="dropdown-label"
                id="dropdown"
                value={value}
                onChange={handleChange}
                sx ={{
                    height: "43px",
                    fontSize: "0.9rem", 
                    padding: "0 12px", 
                    color: "black",
                    backgroundColor: "white"
                }}
            >
                {options.map((option: string, index: number) => (
                    <MenuItem key={index} value={option}>{option}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default Filter;