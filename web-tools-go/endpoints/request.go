package endpoints

type ServiceRequest struct {
	ID    string   `json:"ID"`
	Args  []string `json:"ARGS"`
	Files []string `json:"Files"`
}
